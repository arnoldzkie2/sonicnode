import { getAuth } from "@/lib/nextauth";
import { publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import z from 'zod'
import axios from "axios";
import { API_URL } from "@/lib/api";

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

        const { data } = await axios.post(`${API_URL}/users`, opts.input)

        if (!data) throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "Something Went Wrong"
        })

        return true
    })
    ,
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

        const { data } = await axios.patch(`${API_URL}/users/${auth.user.id}`, opts.input)

        if (!data) throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "Something Went Wrong"
        })

        return true
    })
}