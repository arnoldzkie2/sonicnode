import { z } from "zod";
import { publicProcedure } from "../trpc";
import { getAuth } from "@/lib/nextauth";
import { TRPCError } from "@trpc/server";
import db from "@/lib/db";
import { ORDERSTATUS } from "@/constant/status";

export const orderRoute = {
    createOrder: publicProcedure.input(z.object({
        price: z.string(),
        method: z.string(),
        currency: z.string(),
        receipt: z.string()
    })).mutation(async (opts) => {

        try {

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
                    price, method, currency, receipt, status: ORDERSTATUS['pending'],
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

    })

}