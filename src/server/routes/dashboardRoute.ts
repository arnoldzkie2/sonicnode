import { getAuth } from "@/lib/nextauth";
import { publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import db from "@/lib/db";
import { SonicInfo } from "./serverRoute";

export const dashboadRoute = {
    getDashboardData: publicProcedure.query(async () => {

        try {

            const auth = await getAuth()
            if (!auth) throw new TRPCError({
                code: "UNAUTHORIZED"
            })

            const [user, eggs] = await Promise.all([
                db.users.findUnique({
                    where: { id: auth.user.id }, include: {
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
                        },
                        orders: {
                            take: 5,
                            orderBy: {
                                created_at: 'desc'
                            }
                        },
                    }
                }),
                db.eggs.findMany({
                    select: {
                        name: true,
                        id: true
                    }
                })
            ])
            if (!user) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Something went wrong when getting user servers"
            })

            const totalMonthlyBilling = user.servers.reduce((total, server) => {
                const serverInfo = JSON.parse(server.sonic_info || "{}") as SonicInfo

                if (serverInfo.renewal) {
                    return total + serverInfo.renewal
                }

                return total
            }, 0)

            const modifyOrders = user.orders.map(order => ({
                ...order,
                created_at: order.created_at.toJSON(),
                updated_at: order.updated_at.toJSON()
            }))

            const dashboardData = {
                credits: user.sonic_coin,
                trial_claimed: user.trial_claimed,
                servers: user.servers,
                orders: modifyOrders,
                eggs, totalMonthlyBilling
            }

            return dashboardData

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