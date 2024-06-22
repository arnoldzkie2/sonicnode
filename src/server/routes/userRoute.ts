import { publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import z from 'zod'
import { apiLimiter, sonicApi } from "@/lib/api";
import db from "@/lib/db";
import axios from "axios";
import { SonicInfo } from "./serverRoute";
import { getAuth } from "@/lib/nextauth";

export const userRoute = {
    registerUser: publicProcedure.input(z.object({
        username: z.string(),
        email: z.string(),
        password: z.string(),
        confirm_password: z.string()
    })).mutation(async (opts) => {

        await apiLimiter.consume(1)

        const { password, confirm_password } = opts.input

        try {

            if (password !== confirm_password) throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Password does not matched."
            })

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
                message: "Email Already Exist"
            })

            const { data } = await sonicApi.post('/users', {
                ...opts.input,
                first_name: 'Sonic', last_name: 'Node'
            })

            if (data) {

                return true

            } else {

                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Something went wrong"
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
    verifyRecaptcha: publicProcedure.input(z.string()).mutation(async (opts) => {
        const token = opts.input
        try {

            const recaptchaSecret = process.env.RECAPTCHA_SECRET

            const { data } = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, {}, {
                params: {
                    secret: recaptchaSecret,
                    response: token
                }
            })

            if (data.success) {

                return true

            } else {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Faild toverify recaptcha"
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
    checkFreeTrialClaimed: publicProcedure.query(async () => {
        try {

            const auth = await getAuth()
            if (!auth) throw new TRPCError({
                code: 'UNAUTHORIZED'
            })

            const user = await db.users.findUnique({ where: { id: auth.user.id }, select: { trial_claimed: true } })
            if (!user) throw new TRPCError({
                code: "NOT_FOUND",
                message: "User not found"
            })

            return user.trial_claimed

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
    test: publicProcedure.query(async () => {
        await db.server_plans.update({ where: { id: 1 }, data: { price: 169 } })
        await db.server_plans.update({ where: { id: 2 }, data: { price: 269 } })
        await db.server_plans.update({ where: { id: 3 }, data: { price: 369 } })
        await db.server_plans.update({ where: { id: 4 }, data: { price: 529 } })
        await db.server_plans.update({ where: { id: 5 }, data: { price: 729 } })

        return true
    })
}