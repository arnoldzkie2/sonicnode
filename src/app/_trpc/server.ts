import { createCaller } from "@/server/trpc"
import { appRouter } from '@/server/index';

export const serverClient = createCaller(appRouter)

export const caller = serverClient({})