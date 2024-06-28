import { z } from "zod"
import { publicProcedure } from "../trpc"
import { TRPCError } from "@trpc/server"
import { getAuth } from "@/lib/nextauth"
import db from "@/lib/db"
import { apiLimiter, sonicApi } from "@/lib/api";

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
        planID: z.number(),
        name: z.string(),
        description: z.string().optional(),
        egg: z.number()
    })).mutation(async (opts) => {

        try {

            await apiLimiter.consume(1)

            const { planID, name, egg, description } = opts.input

            if (!name) throw new TRPCError({
                code: "NOT_FOUND",
                message: "Server name is required"
            })
            if (!planID) throw new TRPCError({
                code: "NOT_FOUND",
                message: "Select a plan"
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

            //check if plan exist
            const selectedPlan = await db.server_plans.findUnique({ where: { id: planID } })
            if (!selectedPlan) throw new TRPCError({
                code: "NOT_FOUND",
                message: "Plan does not exist"
            })


            //check if user has enough sonic coin to purchase a server
            if (user.sonic_coin < selectedPlan.price) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "You don't have enough sonic coin to buy this plan"
            })

            //select all nodes that matched the selected plan
            const selectedNodes = await db.nodes.findMany({
                where: { name: selectedPlan.node }
            })
            if (selectedNodes.length === 0) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "No available node please contact our support team."
            })

            //if there is available node with that name proceed
            const availableNode = selectedNodes.filter(node => {

                const nodeDescription: NodeDescription = JSON.parse(node.description as string)

                const {  maxPoints, totalPoints } = nodeDescription

                const remainingPoints = maxPoints - totalPoints
                const requiredPoints = selectedPlan.points

                const newTotalNodePoints = totalPoints + requiredPoints
                const remainingNodePoints = maxPoints - newTotalNodePoints

                // Check if remainingPoints meets requirement and also
                if (remainingPoints >= requiredPoints && remainingNodePoints >=2) {
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
                memory: selectedPlan.ram,
                cpu: selectedPlan.cpu,
                swap: -1,
                disk: selectedPlan.disk * 1000,
                io: 500
            }
            const featureLimits = {
                databases: 1,
                allocations: 5,
                backups: 2
            }

            //make an api call to create the server 
            const { data } = await sonicApi.post('/servers', {
                name: opts.input.name,
                user: user.id,
                description,
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
                nextBillingDate.setDate(nextBillingDate.getDate() + 15);
                return nextBillingDate;
            }
            const nextBillingDate = getNextBillingDate(currentDate);

            //put this in sonic_info so we can parse it later and get additional information
            const sonicInfo: SonicInfo = {
                next_billing: nextBillingDate.toJSON(),
                renewal: selectedPlan.price,
                node_points: selectedPlan.points,
                deletion_countdown: 3
            }

            //get the node points details
            const nodePoints: NodeDescription = JSON.parse(selectedNode.description as string)
            const {  totalPoints, maxPoints } = nodePoints

            //update the node points
            const newNodePoints = JSON.stringify({
                maxPoints,
                totalPoints: totalPoints + selectedPlan.points
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
                updatedBillingDate.setDate(updatedBillingDate.getDate() + 15)

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

                const today = new Date()
                // Create a new Date object and set it to 15 days from today
                const nextBillingDate = new Date();
                nextBillingDate.setDate(today.getDate() + 15);

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
        name: z.string(),
        description: z.string().optional(),
        egg: z.number()
    })).mutation(async (opts) => {

        try {

            await apiLimiter.consume(1)

            const { name, egg, description } = opts.input

            if (!name) throw new TRPCError({
                code: "NOT_FOUND",
                message: "Server name is required"
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

            //get the free trial plan
            const selectedPlan = await db.server_plans.findFirst({ where: { id: 1 } })
            if (!selectedPlan) throw new TRPCError({
                code: "NOT_FOUND",
                message: "Plan does not exist"
            })

            //select all nodes that matched the selected plan
            const selectedNodes = await db.nodes.findMany({
                where: { name: selectedPlan.node }
            })
            if (selectedNodes.length === 0) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "No available node for free trial please try again tomorrow."
            })

            //if there is available node with that name proceed
            const availableNode = selectedNodes.filter(node => {

                const nodeDescription: NodeDescription = JSON.parse(node.description as string)

                const {  maxPoints, totalPoints } = nodeDescription
                const requiredPoints = selectedPlan.points
                const remainingPoints = maxPoints - totalPoints

                // Check if remainingPoints meets requirement
                if ((remainingPoints >= requiredPoints) && (totalPoints < maxPoints)) {
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
                memory: selectedPlan.ram,
                cpu: selectedPlan.cpu,
                swap: -1,
                disk: selectedPlan.disk * 1000,
                io: 500
            }
            const featureLimits = {
                databases: 1,
                allocations: 5,
                backups: 2
            }

            //make an api call to create the server 
            const { data } = await sonicApi.post('/servers', {
                name: opts.input.name,
                user: user.id,
                description,
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
                renewal: selectedPlan.price,
                node_points: selectedPlan.points,
                deletion_countdown: 0
            }

            //get the node points details
            const nodePoints: NodeDescription = JSON.parse(selectedNode.description as string)
            const {  totalPoints, maxPoints } = nodePoints

            //update the node points
            const newNodePoints = JSON.stringify({
                maxPoints,
                totalPoints: totalPoints + selectedPlan.points
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