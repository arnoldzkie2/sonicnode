import { getAuth } from "@/lib/nextauth";
import { publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import z from 'zod'
import { sonicApi } from "@/lib/api";
import db from "@/lib/db";

export const userRoute = {
    getUserData: publicProcedure.query(async () => {
        const auth = await getAuth()

        if (!auth) throw new TRPCError({
            code: "UNAUTHORIZED"
        })

        return auth.user
    }),
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

        } catch (error) {
            console.log(error);
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: "Something went wron"
            })
        }
    }),
    updateUserData: publicProcedure.input(z.object({
        email: z.string(),
        username: z.string(),
        first_name: z.string(),
        last_name: z.string(),
        password: z.string()

    })).mutation(async (opts) => {

        const auth = await getAuth()
        if (!auth) throw new TRPCError({
            code: "UNAUTHORIZED"
        })

        const { data } = await sonicApi.patch(`/users/${auth.user.id}`, opts.input)

        if (!data) throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "Something Went Wrong"
        })

        return true
    }),
    test: publicProcedure.query(async () => {
        const data = await db.eggs.findFirst({
            include: {
                egg_variables: true
            }
        })

        if (!data) throw new TRPCError({
            code: 'BAD_REQUEST'
        })

        const dockerImages = JSON.parse(data.docker_images as string)

        const keysArray = Object.values(dockerImages)[0]

        return keysArray
    })
}