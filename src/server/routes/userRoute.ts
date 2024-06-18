import { publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import z from 'zod'
import { sonicApi } from "@/lib/api";
import db from "@/lib/db";

export const userRoute = {
    registerUser: publicProcedure.input(z.object({
        username: z.string(),
        email: z.string(),
        password: z.string()
    })).mutation(async (opts) => {

        try {

            const [existingUsername, existingEmail] = await Promise.all([
                db.users.findUnique({ where: { username: opts.input.username } }),
                db.users.findUnique({ where: { email: opts.input.email } })
            ])

            if (existingUsername) throw new TRPCError({
                code: 'CONFLICT',
                message: "Username Already Exist"
            })
            if (existingEmail) throw new TRPCError({
                code: 'CONFLICT',
                message: "Username Already Exist"
            })

            const { data } = await sonicApi.post('/users', { ...opts.input, first_name: 'Sonic', last_name: 'Node' })

            if (data) return true

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