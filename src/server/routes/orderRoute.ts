import { z } from "zod";
import { publicProcedure } from "../trpc";
import { getAuth } from "@/lib/nextauth";
import { TRPCError } from "@trpc/server";
import db from "@/lib/db";
import { ORDERSTATUS } from "@/constant/status";
import { apiLimiter } from "@/lib/api";
import { OrderVerified } from '@/components/emails/order-verified'
import InvalidOrder from "@/components/emails/order-invalid";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY as string)

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
    getUserOrders: publicProcedure.query(async () => {
        try {

            const auth = await getAuth()
            if (!auth) throw new TRPCError({
                code: "UNAUTHORIZED"
            })

            const user = await db.users.findUnique({
                where: { id: auth.user.id },
                include: {
                    orders: {
                        take: 5,
                        orderBy: {
                            created_at: 'desc'
                        }
                    }
                }
            })
            if (!user) throw new TRPCError({
                code: "NOT_FOUND",
                message: "User not found"
            })

            const modifyOrders = user.orders.map(order => ({
                ...order,
                created_at: order.created_at.toJSON(),
                updated_at: order.updated_at.toJSON()
            }))

            return modifyOrders

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
                    note: "Once we verify your order, you will receive an email notification and your Sonic Coin will be added to your account.",
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
            const [updateOrder, giveUserSonicCoin, notifyUser] = await Promise.all([
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
                        sonic_coin: user.sonic_coin + amount
                    }
                }),
                resend.emails.send({
                    from: 'SonicNode <support@sonicnode.xyz>',
                    to: user.email,
                    subject: 'Order verified',
                    reply_to: 'support@sonicnode.xyz',
                    react: OrderVerified({ username: user.username, sonic_amount: amount }),
                })
            ])

            if (notifyUser.error) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Faild to send email to user"
            })

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
            const [updateOrder, invalidOrder] = await Promise.all([
                db.users_orders.update({
                    where: { id: order.id },
                    data: {
                        status: ORDERSTATUS['invalid'],
                        note: "If you think this is a mistake please contact our support team."
                    }
                }),
                resend.emails.send({
                    from: 'SonicNode <support@sonicnode.xyz>',
                    to: auth.user.email,
                    subject: 'Invalid Order',
                    reply_to: 'support@sonicnode.xyz',
                    react: InvalidOrder({ username: auth.user.username }),
                    text: ""
                })
            ])

            if (!updateOrder) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to update user order"
            })

            if (invalidOrder.error) throw new TRPCError({
                code: "BAD_REQUEST",
                message: invalidOrder.error.message
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