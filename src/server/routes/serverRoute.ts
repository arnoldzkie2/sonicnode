import { z } from "zod"
import { publicProcedure } from "../trpc"
import { TRPCError } from "@trpc/server"
import { getAuth } from "@/lib/nextauth"
import db from "@/lib/db"
import { apiLimiter, sonicApi } from "@/lib/api";
import { serverPlan } from "@/constant/plans"

interface NodeDescription {
    maxPoints: number
    totalPoints: number
}

interface SonicInfo {
    next_billing: string;
    renewal: number;
    node_points: number;
    deletion_countdown: number;
}

export type { SonicInfo, NodeDescription }

export const serverRoute = {
    getUserServers: publicProcedure.query(async () => {
        try {

            const auth = await getAuth()
            if (!auth) throw new TRPCError({
                code: "UNAUTHORIZED"
            })

            const user = await db.users.findUnique({
                where: { id: auth.user.id }, select: {
                    servers: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            sonic_info: true,
                            status: true,
                            disk: true,
                            cpu: true,
                            memory: true
                        }
                    }
                }
            })
            if (!user) throw new TRPCError({
                code: 'NOT_FOUND',
                message: "User not found"
            })

            return user.servers

        } catch (error: any) {
            console.error(error);
            throw new TRPCError({
                code: error.code,
                message: error.message
            })
        } finally {
            await db.$disconnect()
        }
    }),
    createServer: publicProcedure.input(z.object({
        planPoints: z.number(),
        egg: z.number()
    })).mutation(async (opts) => {

        try {

            await apiLimiter.consume(1)

            const { planPoints, egg } = opts.input

            if (!planPoints) throw new TRPCError({
                code: "NOT_FOUND",
                message: "Select a plan"
            })
            if (planPoints > 6) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Invalid plan"
            })

            if (!egg) throw new TRPCError({
                code: "NOT_FOUND",
                message: "Server Type is required"
            })
            const auth = await getAuth()
            if (!auth) throw new TRPCError({
                code: 'UNAUTHORIZED'
            })
            const user = await db.users.findUnique({ where: { id: auth.user.id } })
            if (!user) throw new TRPCError({
                code: 'NOT_FOUND',
                message: "User does not exist"
            })

            const selectedPlan = {
                cpu: serverPlan.cpu * planPoints,
                ram: serverPlan.ram * planPoints,
                disk: serverPlan.disk * planPoints,
                player: serverPlan.player * planPoints,
                port: serverPlan.port * planPoints,
                price: serverPlan.price * planPoints,
            }

            //check if user has enough sonic coin to purchase a server
            if (user.sonic_coin < selectedPlan.price) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "You don't have enough sonic coin to buy this plan"
            })

            //select all nodes that matched the selected plan
            const selectedNodes = await db.nodes.findMany()
            if (selectedNodes.length === 0) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "No available node please contact our support team."
            })

            //if there is available node with that name proceed
            const availableNode = selectedNodes.filter(node => {

                const nodeDescription: NodeDescription = JSON.parse(node.description as string)
                if (!nodeDescription) throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "No available node, Please contact our support team."
                })

                const { maxPoints, totalPoints } = nodeDescription

                const remainingPoints = maxPoints - totalPoints
                const requiredPoints = planPoints

                // Check if remainingPoints meets requirement and also
                if (remainingPoints >= requiredPoints) {
                    return true; // Node qualifies based on conditions
                } else {
                    return false; // Node does not qualify
                }
            })

            if (availableNode.length === 0) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "No available node please contact our support team."
            })

            //get the first selected node
            const selectedNode = availableNode[0]

            //get all the node allocations
            const allocations = await sonicApi.get(`/nodes/${selectedNode.id}/allocations`)

            //throw an error of node doesn't have available ports
            if (allocations.data.data.length === 0) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Node doesn't have available ports please contact our support team."
            })

            //get 1 unassigned allocation
            const unassignedAllocation = allocations.data.data.find((allocation: any) => !allocation.attributes.assigned);

            //throw an error of node doesn't have available ports
            if (!unassignedAllocation) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Node doesn't have available ports please contact our support team."
            })

            const checkEgg = await db.eggs.findUnique({
                where: { id: opts.input.egg }, include: {
                    egg_variables: true
                }
            })
            if (!checkEgg) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Server type does not exist"
            })

            // VARIABLES
            //this is the variables we'll use to create the server
            const dockerImages = Object.values(checkEgg.docker_images as string)
            const eggEnvironment = checkEgg.egg_variables.reduce((acc: any, variable) => {
                acc[variable.env_variable] = variable.default_value;
                return acc;
            }, {})

            const selectedImage = Object.values(dockerImages)[0] as string
            const defaultPortID = unassignedAllocation.attributes.id
            const resources = {
                memory: selectedPlan.ram * 1024,
                cpu: selectedPlan.cpu,
                swap: -1,
                disk: selectedPlan.disk * 1024,
                io: 500
            }
            const featureLimits = {
                databases: 1,
                allocations: selectedPlan.port * planPoints,
                backups: 1
            }

            //make an api call to create the server 
            const { data } = await sonicApi.post('/servers', {
                name: `${user.username} Server`,
                user: user.id,
                nest: checkEgg.nest_id,
                egg: checkEgg.id,
                docker_image: selectedImage,
                startup: checkEgg.startup,
                environment: {
                    ...eggEnvironment,
                    STARTUP: checkEgg.startup
                },
                limits: resources,
                feature_limits: featureLimits,
                allocation: {
                    default: defaultPortID
                }
            })

            if (!data) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Something went wrong when creating a server"
            })


            //if the server successfully created update the usercredits,server renewal cost, node points
            // Get the current date
            const currentDate = new Date();

            // Function to add 30 days to the current date
            const getNextBillingDate = (date: Date) => {
                let nextBillingDate = new Date(date);
                nextBillingDate.setDate(nextBillingDate.getDate() + 30);
                return nextBillingDate;
            }
            const nextBillingDate = getNextBillingDate(currentDate);

            //put this in sonic_info so we can parse it later and get additional information
            const sonicInfo: SonicInfo = {
                next_billing: nextBillingDate.toJSON(),
                renewal: selectedPlan.price,
                node_points: planPoints,
                deletion_countdown: 3
            }

            //get the node points details
            const nodePoints: NodeDescription = JSON.parse(selectedNode.description as string)
            const { totalPoints, maxPoints } = nodePoints

            //update the node points
            const newNodePoints = JSON.stringify({
                maxPoints,
                totalPoints: totalPoints + planPoints
            })

            //update user credits,serverinfo,node points
            const [updateUserCredit, updateServerInfo, updateNodePoints] = await Promise.all([
                db.users.update({
                    where: { id: user.id },
                    data: { sonic_coin: user.sonic_coin - selectedPlan.price }
                }),
                db.servers.update({
                    where: { id: data.attributes.id as number },
                    data: {
                        sonic_info: JSON.stringify(sonicInfo)
                    }
                }),
                db.nodes.update({
                    where: { id: selectedNode.id },
                    data: { description: newNodePoints }
                })
            ])

            if (!updateUserCredit) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to update user credit"
            })
            if (!updateServerInfo) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to deduct user credit"
            })
            if (!updateNodePoints) throw new TRPCError({
                code: "BAD_REQUEST",
                message: " Failed to update node new points"
            })

            return true

        } catch (error: any) {
            console.error(error);
            throw new TRPCError({
                code: error.code,
                message: error.message
            })
        } finally {
            await db.$disconnect()
        }
    }),
    checkBilling: publicProcedure.query(async () => {

        await apiLimiter.consume(1)

        const servers = await db.servers.findMany({
            where: {
                sonic_info: {
                    not: null
                }
            },
            select: {
                id: true,
                node_id: true,
                sonic_info: true,
                users: {
                    select: {
                        id: true,
                        sonic_coin: true
                    }
                }
            }
        })
        if (!servers) throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to get all servers"
        })

        // Get today's date and yesterday's date
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        // Helper function to check if a date is today or yesterday
        const isTodayOrPast = (date: Date) => {
            const d = new Date(date); // Convert input date to Date object
            return d <= today; // Compare date with today's date
        };

        //filter the servers if the next_billing is today
        const serversToUpdate = servers
            .map(server => ({
                ...server,
                sonic_info: JSON.parse(server.sonic_info || '') as SonicInfo
            }))
            .filter(server => isTodayOrPast(new Date(server.sonic_info.next_billing)))

        // Prepare batch updates

        for (const server of serversToUpdate) {

            const nextBillingDate = new Date(server.sonic_info.next_billing);
            const renewalAmount = server.sonic_info.renewal;
            const user = await db.users.findUnique({ where: { id: server.users.id }, select: { sonic_coin: true } })
            if (!user) throw new TRPCError({
                code: "NOT_FOUND",
                message: "User not found"
            })
            const userBalance = user.sonic_coin

            if (userBalance >= renewalAmount) {
                // Deduct the renewal amount from the user's balance

                // Update the server's next_billing date
                const updatedBillingDate = new Date(nextBillingDate);
                updatedBillingDate.setDate(updatedBillingDate.getDate() + 30)

                const newInfo: SonicInfo = {
                    ...server.sonic_info,
                    deletion_countdown: 3,
                    next_billing: updatedBillingDate.toJSON()
                }

                // user has successfully renew the server
                await Promise.all([
                    db.users.update({
                        where: { id: server.users.id },
                        data: { sonic_coin: userBalance - renewalAmount },
                    }),
                    db.servers.update({
                        where: { id: server.id },
                        data: {
                            sonic_info: JSON.stringify(newInfo),
                            status: null
                        },
                    })
                ])

            } else {

                if (server.sonic_info.deletion_countdown) {
                    //if server deletion is not 0 reduce it to 1 day

                    const newInfo: SonicInfo = {
                        ...server.sonic_info,
                        deletion_countdown: server.sonic_info.deletion_countdown - 1,
                    }

                    // user has failed renew the server and their server is suspended and deletion date get's reduce day by day
                    //update sonic info and suspend the server
                    await db.servers.update({
                        where: { id: server.id },
                        data: { sonic_info: JSON.stringify(newInfo), status: "suspended" }
                    })

                } else {
                    //server will be deleted after 5 days of countdown
                    //delete the server and update the node totalPoints

                    const node = await db.nodes.findUnique({ where: { id: server.node_id } })
                    if (!node) throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Node not found"
                    })

                    const nodePoints: NodeDescription = JSON.parse(node.description || '')

                    const newNodePoints: NodeDescription = {
                        maxPoints: nodePoints.maxPoints,
                        totalPoints: nodePoints.totalPoints - server.sonic_info.node_points
                    }

                    // user has failed renew the server and is being deleted
                    //update node points and delelete the server
                    await Promise.all([
                        db.nodes.update({
                            where: { id: server.node_id },
                            data: { description: JSON.stringify(newNodePoints) }
                        }),
                        db.servers.delete({ where: { id: server.id } })
                    ])
                }
            }
        }

        return true

    }),
    renewServer: publicProcedure.input(z.number()).mutation(async (opts) => {

        try {

            await apiLimiter.consume(1)

            const auth = await getAuth()
            if (!auth) throw new TRPCError({
                code: "UNAUTHORIZED"
            })

            const serverID = opts.input

            //get the server and user
            const server = await db.servers.findUnique({
                where: { id: serverID }, select: {
                    id: true,
                    sonic_info: true,
                    users: {
                        select: {
                            id: true,
                            sonic_coin: true
                        }
                    }
                }
            })

            if (!server) throw new TRPCError({
                code: "NOT_FOUND",
                message: "Server not found"
            })

            // get the sonic info for renewal
            const sonicInfo: SonicInfo = JSON.parse(server.sonic_info || "")

            //check if user has enough balance to renew the server
            if (server.users.sonic_coin >= sonicInfo.renewal) {

                const billingDate = new Date(sonicInfo.next_billing);
                // Create a new Date object and set it to 30 days from billingDate
                const nextBillingDate = new Date(billingDate);
                nextBillingDate.setDate(nextBillingDate.getDate() + 30);

                //define the new server sonic info
                const newServerInfo: SonicInfo = {
                    ...sonicInfo,
                    next_billing: nextBillingDate.toJSON(),
                    deletion_countdown: 3
                }

                //update the user balance and the server renewal and next billing
                const [updateUserCredit, updateServerInfo] = await Promise.all([
                    db.users.update({
                        where: { id: server.users.id }, data: {
                            sonic_coin: server.users.sonic_coin - sonicInfo.renewal
                        }
                    }),
                    db.servers.update({
                        where: { id: server.id },
                        data: { sonic_info: JSON.stringify(newServerInfo), status: null }
                    }),
                ])
                if (!updateUserCredit) throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Something went wrong when updating user sonic coins"
                })
                if (!updateServerInfo) throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Something went wrong when updating server info"
                })

                return true

            } else {

                //throw an error that says user doesn't have enough balance to renew the server
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Not enough sonic coin to renew the server"
                })
            }

        } catch (error: any) {
            console.error(error);
            throw new TRPCError({
                code: error.code,
                message: error.message
            })
        } finally {
            await db.$disconnect()
        }
    }),
    createFreeTrialServer: publicProcedure.input(z.object({
        egg: z.number()
    })).mutation(async (opts) => {

        try {

            await apiLimiter.consume(1)

            const { egg } = opts.input

            if (!egg) throw new TRPCError({
                code: "NOT_FOUND",
                message: "Server Type is required"
            })
            const auth = await getAuth()
            if (!auth) throw new TRPCError({
                code: 'UNAUTHORIZED'
            })
            const user = await db.users.findUnique({ where: { id: auth.user.id } })
            if (!user) throw new TRPCError({
                code: 'NOT_FOUND',
                message: "User does not exist"
            })

            //get the free trial plan
            const planPoints = 1

            //select all nodes that matched the selected plan
            const selectedNodes = await db.nodes.findMany()
            if (selectedNodes.length === 0) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "No available node for free trial please try again tomorrow."
            })

            //if there is available node with that name proceed
            const availableNode = selectedNodes.filter(node => {

                const nodeDescription: NodeDescription = JSON.parse(node.description as string)

                if (!nodeDescription) throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "No available node for free trial please try again tomorrow."
                })

                const { maxPoints, totalPoints } = nodeDescription
                const requiredPoints = planPoints
                const remainingPoints = maxPoints - totalPoints

                // Check if remainingPoints meets requirement
                if (remainingPoints >= requiredPoints) {
                    return true; // Node qualifies based on conditions
                } else {
                    return false; // Node does not qualify
                }
            })
            if (availableNode.length === 0) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "No available node for free trial please try again tomorrow."
            })

            //get the first selected node
            const selectedNode = availableNode[0]

            //get all the node allocations
            const allocations = await sonicApi.get(`/nodes/${selectedNode.id}/allocations`)

            //throw an error of node doesn't have available ports
            if (allocations.data.data.length === 0) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Node doesn't have available ports please contact our support team."
            })

            //get 1 unassigned allocation
            const unassignedAllocation = allocations.data.data.find((allocation: any) => !allocation.attributes.assigned);

            //throw an error of node doesn't have available ports
            if (!unassignedAllocation) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Node doesn't have available ports please contact our support team."
            })

            const checkEgg = await db.eggs.findUnique({
                where: { id: opts.input.egg }, include: {
                    egg_variables: true
                }
            })
            if (!checkEgg) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Server type does not exist"
            })

            // VARIABLES
            //this is the variables we'll use to create the server
            const dockerImages = Object.values(checkEgg.docker_images as string)
            const eggEnvironment = checkEgg.egg_variables.reduce((acc: any, variable) => {
                acc[variable.env_variable] = variable.default_value;
                return acc;
            }, {})

            const selectedImage = Object.values(dockerImages)[0] as string
            const defaultPortID = unassignedAllocation.attributes.id
            const resources = {
                memory: serverPlan.ram * 1024,
                cpu: serverPlan.cpu,
                swap: -1,
                disk: serverPlan.disk * 1024,
                io: 500
            }
            const featureLimits = {
                databases: 1,
                allocations: 5,
                backups: 2
            }

            //make an api call to create the server 
            const { data } = await sonicApi.post('/servers', {
                name: `${user.username} Free Trial`,
                user: user.id,
                nest: checkEgg.nest_id,
                egg: checkEgg.id,
                docker_image: selectedImage,
                startup: checkEgg.startup,
                environment: {
                    ...eggEnvironment,
                    STARTUP: checkEgg.startup
                },
                limits: resources,
                feature_limits: featureLimits,
                allocation: {
                    default: defaultPortID
                }
            })

            if (!data) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Something went wrong when creating a server"
            })

            //if the server successfully created update the usercredits,server renewal cost, node points
            // Get the current date
            const currentDate = new Date();

            // Function to add 3 days to the current date
            const getNextBillingDate = (date: Date) => {
                let nextBillingDate = new Date(date);
                nextBillingDate.setDate(nextBillingDate.getDate() + 3);
                return nextBillingDate;
            }
            const nextBillingDate = getNextBillingDate(currentDate);

            //put this in sonic_info so we can parse it later and get additional information
            const sonicInfo: SonicInfo = {
                next_billing: nextBillingDate.toJSON(),
                renewal: serverPlan.price,
                node_points: planPoints,
                deletion_countdown: 0
            }

            //get the node points details
            const nodePoints: NodeDescription = JSON.parse(selectedNode.description as string)
            const { totalPoints, maxPoints } = nodePoints

            //update the node points
            const newNodePoints = JSON.stringify({
                maxPoints,
                totalPoints: totalPoints + planPoints
            })

            //update user credits,serverinfo,node points
            const [updateUserInfo, updateServerInfo, updateNodePoints] = await Promise.all([
                db.users.update({ where: { id: user.id }, data: { trial_claimed: true } }),
                db.servers.update({
                    where: { id: data.attributes.id as number },
                    data: {
                        sonic_info: JSON.stringify(sonicInfo)
                    }
                }),
                db.nodes.update({
                    where: { id: selectedNode.id },
                    data: { description: newNodePoints }
                })
            ])
            if (!updateUserInfo) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to update user info"
            })
            if (!updateServerInfo) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to deduct user credit"
            })
            if (!updateNodePoints) throw new TRPCError({
                code: "BAD_REQUEST",
                message: " Failed to update node new points"
            })

            return true

        } catch (error: any) {
            console.error(error);
            throw new TRPCError({
                code: error.code,
                message: error.message
            })
        } finally {
            await db.$disconnect()
        }
    }),
}