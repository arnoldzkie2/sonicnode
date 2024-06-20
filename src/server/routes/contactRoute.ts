import { Resend } from "resend";
import { publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { apiLimiter } from "@/lib/api";

const resend = new Resend(process.env.RESEND_API_KEY as string)
export const contactRoute = {
    send: publicProcedure.input(z.object({
        name: z.string(),
        email: z.string(),
        message: z.string()
    })).mutation(async (opts) => {
        try {

            await apiLimiter.consume(1)
            const { error } = await resend.emails.send({
                to: 'support@sonicnode.xyz',
                from: `SonicNode <support@sonicnode.xyz>`,
                text: opts.input.message,
                reply_to: opts.input.email,
                subject: `Message from: ${opts.input.name}`
            })

            if (error) throw new TRPCError({
                code: "BAD_REQUEST",
                message: error.message
            })

            return true

        } catch (error: any) {
            console.error(error);
            throw new TRPCError({
                code: error.code,
                message: error.message
            })
        }
    })
}