import { z } from "zod"
import { publicProcedure } from "../trpc"
import { TRPCError } from "@trpc/server"
import { getAuth } from "@/lib/nextauth"
import db from "@/lib/db"
import { PLANS } from "@/constant/plans"
import { sonicApi } from "@/lib/api";

interface NodeDescription {
    maxPoints: number
    totalPoints: number
    remainingPoints: number
}

export const serverRoute = {
    createServer: publicProcedure.input(z.object({
        plan: z.string(),
        name: z.string(),
        egg: z.number()
    })).mutation(async (opts) => {

        try {

            const { plan, name, egg } = opts.input

            if (!name) throw new TRPCError({
                code: "NOT_FOUND",
                message: "Server name is required"
            })
            if (!plan) throw new TRPCError({
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
            const selectedPlan = PLANS.find(plan => plan.name.toLowerCase() === opts.input.plan.toLowerCase());

            if (selectedPlan) {

                //check if user has enough sonic coin to purchase a server
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

                        const nodeDescription: NodeDescription = JSON.parse(node.description as string)
                        const { remainingPoints, maxPoints, totalPoints } = nodeDescription
                        const requiredPoints = selectedPlan.points

                        // Check if remainingPoints meets requirement
                        if ((remainingPoints >= requiredPoints) && (totalPoints < maxPoints)) {
                            return true; // Node qualifies based on conditions
                        } else {
                            return false; // Node does not qualify
                        }
                    })

                    if (availableNode.length > 0) {

                        //get the first selected node
                        const selectedNode = availableNode[0]

                        //get all the node allocations
                        const { data } = await sonicApi.get(`/nodes/${selectedNode.id}/allocations`)

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

                                // Get the current date
                                const currentDate = new Date();

                                // Function to add 30 days to the current date
                                const getNextBillingDate = (date: Date) => {
                                    let nextBillingDate = new Date(date);
                                    nextBillingDate.setDate(nextBillingDate.getDate() + 30);
                                    return nextBillingDate;
                                }
                                const nextBillingDate = getNextBillingDate(currentDate);

                                const serverDescription = nextBillingDate.toJSON()
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
                                    description: serverDescription,
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

                                //if the server successfully created update the usercredits,server renewal cost, node points
                                if (data) {

                                    //get the node points details
                                    const nodePoints: NodeDescription = JSON.parse(selectedNode.description as string)
                                    const { remainingPoints, totalPoints, maxPoints } = nodePoints

                                    const newNodePoints = JSON.stringify({
                                        maxPoints,
                                        totalPoints: totalPoints + selectedPlan.points,
                                        remainingPoints: remainingPoints - selectedPlan.points
                                    })

                                    //update user credits
                                    const [updateUserCredit, updateServerRenewal, updateNodePoints] = await Promise.all([
                                        db.users.update({
                                            where: { id: user.id },
                                            data: { store_balance: user.store_balance - selectedPlan.price }
                                        }),
                                        db.servers.update({
                                            where: { id: data.attributes.id as number },
                                            data: { renewal: selectedPlan.price }
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
                                    if (!updateServerRenewal) throw new TRPCError({
                                        code: "BAD_REQUEST",
                                        message: "Failed to deduct user credit"
                                    })
                                    if (!updateNodePoints) throw new TRPCError({
                                        code: "BAD_REQUEST",
                                        message: " Failed to update node new points"
                                    })

                                    return true

                                } else {
                                    throw new TRPCError({
                                        code: "BAD_REQUEST",
                                        message: "Something went wrong when creating a server"
                                    })

                                }


                            } else {

                                //throw an error of node doesn't have available ports
                                throw new TRPCError({
                                    code: "BAD_REQUEST",
                                    message: "Node doesn't have available ports please contact our support team."
                                })
                            }

                        } else {

                            //throw an error of node doesn't have available ports
                            throw new TRPCError({
                                code: "BAD_REQUEST",
                                message: "Node doesn't have available ports please contact our support team."
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

                //throw an error if plan does not exist
                throw new TRPCError({ code: 'NOT_FOUND', message: "Plan does not exist" })
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
    })
}