import { TRPCError } from "@trpc/server";
import { publicProcedure } from "../trpc";
import db from "@/lib/db";
import { z } from "zod";
import { getAuth } from "@/lib/nextauth";

export const serverPlansRoute = {
    getAll: publicProcedure.query(async () => {
        try {

            const plans = await db.server_plans.findMany()
            if (!plans) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to get all plans"
            })

            const sortPlans = plans.sort((a, b) => a.ram - b.ram)

            return sortPlans

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
    createPlan: publicProcedure.input(z.object({
        name: z.string(),
        node: z.string(),
        cpu_speed: z.string(),
        ram: z.number(),
        disk: z.number(),
        price: z.number(),
        points: z.number(),
        description: z.string(),
        cpu: z.number(),
        players: z.number()

    })).mutation(async (opts) => {

        try {

            //auth user
            const auth = await getAuth()
            if (!auth || !auth.user.root_admin) throw new TRPCError({
                code: "UNAUTHORIZED"
            })

            const data = opts.input

            //create the plan
            const createPlan = await db.server_plans.create({ data })
            if (!createPlan) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to create server plan"
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