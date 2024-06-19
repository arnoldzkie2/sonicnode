import { z } from "zod";
import { publicProcedure } from "../trpc";
import { getAuth } from "@/lib/nextauth";
import { TRPCError } from "@trpc/server";
import db from "@/lib/db";
import { ORDERSTATUS } from "@/constant/status";
import { apiLimiter } from "@/lib/api";

export const orderRoute = {

    getAllOrders: publicProcedure.input(z.object({
        status: z.string()
    })).query(async (opts) => {

        const status = opts.input.status

        try {

            const auth = await getAuth()
            if (!auth || !auth.user.root_admin) throw new TRPCError({
                code: "UNAUTHORIZED"
            })

            //get all orders
            const [orders, totalOrders] = await Promise.all([
                db.users_orders.findMany({
                    where: {
                        status
                    },
                    orderBy: {
                        created_at: 'desc'
                    }
                }),
                db.users_orders.count()
            ])
            if (!orders) throw new TRPCError({
                code: 'BAD_REQUEST',
                message: "Failed to get all orders"
            })

            return {
                orders,
                totalOrders
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
    createOrder: publicProcedure.input(z.object({
        price: z.string(),
        method: z.string(),
        currency: z.string(),
        receipt: z.string()
    })).mutation(async (opts) => {

        try {

            await apiLimiter.consume(1)

            const { price, method, currency, receipt } = opts.input

            if (!price || !method || !currency || !receipt) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Missing inputs"
            })

            //authorize user 
            const auth = await getAuth()
            if (!auth) throw new TRPCError({
                code: 'UNAUTHORIZED'
            })

            //retrieve user
            const user = await db.users.findUnique({
                where: { id: auth.user.id }, include: {
                    orders: true
                }
            })
            if (!user) throw new TRPCError({
                code: "NOT_FOUND",
                message: "User not found"
            })

            //check if user has pending orders or has 5 invalid orders
            if (user.orders.some(order => order.status === ORDERSTATUS['pending'])) {
                //delete the image in uploadthing

                //throw an error
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "You cannot create more than 1 pending orders"
                });
            }

            const invalidOrdersCount = user.orders.filter(order => order.status === ORDERSTATUS['invalid']).length;
            if (invalidOrdersCount >= 5) {
                //delete the image in uploadthing


                //throw an error
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "You cannot have more than 5 invalid orders"
                });
            }

            //create the order
            const createOrder = await db.users_orders.create({
                data: {
                    price, method, currency, receipt,
                    status: ORDERSTATUS['pending'],
                    amount: 'pending',
                    note: "Our team will automatically calculate the total amount of sonic coins after the payment is verified.",
                    user: {
                        connect: {
                            id: user.id
                        }
                    }
                }
            })
            if (!createOrder) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to create order"
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
    confirmOrder: publicProcedure.input(z.object({
        orderID: z.number(),
        amount: z.number()
    })).mutation(async (opts) => {
        try {

            await apiLimiter.consume(1)
            const auth = await getAuth()
            if (!auth || !auth.user.root_admin) throw new TRPCError({
                code: "UNAUTHORIZED"
            })

            const { orderID, amount } = opts.input

            if (!orderID) throw new TRPCError({
                code: 'NOT_FOUND',
                message: "Order not found"
            })

            if (!amount || amount <= 0) throw new TRPCError({
                code: 'BAD_REQUEST',
                message: "Amount should be positive number"
            })

            //retrieve order
            const order = await db.users_orders.findUnique({ where: { id: orderID } })
            if (!order) throw new TRPCError({
                code: 'NOT_FOUND',
                message: "Order not found"
            })

            //check if order is already completed or invalid
            if (order.status !== ORDERSTATUS['pending']) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Order is either invalid or completed."
            })

            //retrieve the user
            const user = await db.users.findUnique({ where: { id: order.user_id } })
            if (!user) throw new TRPCError({
                code: "NOT_FOUND",
                message: "User not found"
            })

            //update the order and give the user their sonic coin
            const [updateOrder, giveUserSonicCoin] = await Promise.all([
                db.users_orders.update({
                    where: { id: order.id },
                    data: {
                        note: `Sonic coin received: ${amount}`,
                        status: ORDERSTATUS['completed']
                    }
                }),
                db.users.update({
                    where: { id: user.id },
                    data: {
                        store_balance: user.store_balance + amount
                    }
                })
            ])

            if (!updateOrder) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to update user order"
            })
            if (!giveUserSonicCoin) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to update user coins"
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
    invalidOrder: publicProcedure.input(z.number()).mutation(async (opts) => {

        try {

            const auth = await getAuth()
            if (!auth || !auth.user.root_admin) throw new TRPCError({
                code: "UNAUTHORIZED"
            })

            const orderID = opts.input

            const order = await db.users_orders.findUnique({ where: { id: orderID } })
            if (!order) throw new TRPCError({
                code: "NOT_FOUND",
                message: "Order not found"
            })

            //update the order status
            const updateOrder = await db.users_orders.update({
                where: { id: order.id },
                data: {
                    status: ORDERSTATUS['invalid'],
                    note: "If you think this is a mistake please contact our support team."
                }
            })
            if (!updateOrder) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to update user order"
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
    })
}