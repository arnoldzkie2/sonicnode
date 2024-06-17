import { getAuth } from "@/lib/nextauth";
import { publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import db from "@/lib/db";
import z from 'zod'
import { PLANS } from "@/constant/plans";
import { sonicApi } from "@/lib/api";

export const dashboadRoute = {
    getDashboardData: publicProcedure.query(async () => {

        const auth = await getAuth()
        if (!auth) throw new TRPCError({
            code: "UNAUTHORIZED"
        })

        const user = await db.users.findUnique({
            where: { id: auth.user.id }, include: {
                servers: true
            }
        })
        if (!user) throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Something went wrong when getting user servers"
        })

        const eggs = await db.eggs.findMany({
            select: {
                name: true,
                id: true
            }
        })

        const userData = {
            credits: user.store_balance,
            servers: user.servers,
            eggs
        }

        return userData

    }),
    createServer: publicProcedure.input(z.object({
        plan: z.string(),
        name: z.string(),
        egg: z.number()
    })).mutation(async (opts) => {

        const auth = await getAuth()
        if (!auth) throw new TRPCError({
            code: 'UNAUTHORIZED'
        })

        const user = await db.users.findUnique({ where: { id: auth.user.id } })
        if (!user) throw new TRPCError({
            code: 'NOT_FOUND',
            message: "User does not exist"
        })

        const selectedPlan = PLANS.find(plan => plan.name.toLowerCase() === opts.input.plan.toLowerCase());

        if (selectedPlan) {

            if (user.store_balance < selectedPlan.price) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "You don't have enough balance to buy this plan"
            })

            //select all nodes that matched the selected plan
            const selectedNodes = await db.nodes.findMany({
                where: { name: selectedPlan.node }, include: {
                    servers: true
                }
            })

            //if there is available node with that name proceed
            if (selectedNodes.length > 0) {

                const availableNode = selectedNodes.filter(node => {

                    const totalPoints = node.servers.reduce((total, server) => {
                        return total + Number(server.description)
                    }, 0)

                    const maxPoints = Number(node.description);

                    // Calculate remaining points
                    const remainingPoints = maxPoints - totalPoints;

                    const requiredPoints = selectedPlan.points

                    // Check if remainingPoints meets requirement
                    if (remainingPoints >= requiredPoints) {
                        return true; // Node qualifies based on conditions
                    } else {
                        return false; // Node does not qualify
                    }
                })

                if (availableNode.length > 0) {

                    try {

                        //get all the node allocations

                        const { data } = await sonicApi.get(`/nodes/${availableNode[0].id}/allocations`)

                        if (data.data.length > 0) {

                            //get 1 unassigned allocation
                            const unassignedAllocation = data.data.find((allocation: any) => !allocation.attributes.assigned);

                            if (unassignedAllocation) {

                                const checkEgg = await db.eggs.findUnique({
                                    where: { id: opts.input.egg }, include: {
                                        egg_variables: true
                                    }
                                })
                                if (!checkEgg) throw new TRPCError({
                                    code: "BAD_REQUEST",
                                    message: "Server type does not exist"
                                })
                                const dockerImages = JSON.parse(checkEgg.docker_images as string)

                                //this is the variables we'll use to create the server
                                const eggEnvironment = checkEgg.egg_variables.reduce((acc: any, variable) => {
                                    acc[variable.env_variable] = variable.default_value;
                                    return acc;
                                }, {})

                                const serverName = opts.input.name
                                const serverDescription = selectedPlan.points
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

                                try {

                                    const { data } = await sonicApi.post('/servers', {
                                        name: serverName,
                                        user: user.id,
                                        description: String(serverDescription),
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

                                    if (data) {

                                        //update user credits
                                        const [updateUserCredit, updateServerRenewal] = await Promise.all([
                                            db.users.update({
                                                where: { id: user.id },
                                                data: { store_balance: user.store_balance - selectedPlan.price }
                                            }),
                                            db.servers.update({
                                                where: { id: data.attributes.id as number },
                                                data: { renewal: selectedPlan.price }
                                            })
                                        ])

                                        if (!updateUserCredit) throw new TRPCError({
                                            code: "BAD_REQUEST",
                                            message: "Failed to update user credit"
                                        })
                                        if (!updateServerRenewal) throw new TRPCError({
                                            code: "BAD_REQUEST",
                                            message: "Failed to deduct user credit"
                                        })

                                        return true
                                    }

                                } catch (error) {
                                    console.log(error)
                                    throw new TRPCError({
                                        code: "BAD_REQUEST",
                                        message: "Something went wrong while creating the server"
                                    })
                                }

                            } else {
                                throw new TRPCError({
                                    code: "BAD_REQUEST",
                                    message: "Node doesn't have available ports"
                                })
                            }

                        }


                    } catch (error) {
                        //throw an error if it failed to get the allocations
                        console.log(error);
                        throw new TRPCError({
                            code: "BAD_REQUEST",
                            message: "Failed to get node allocations"
                        })
                    }

                } else {

                    //throw an error if there is not enough space for a node to create the plan

                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "No available node please contact our support team."
                    })
                }

            } else {

                //throw an error if no available node in the plan

                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "No available node please contact our support team."
                })
            }
        } else {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Plan does not exist" })
        }
    })
}