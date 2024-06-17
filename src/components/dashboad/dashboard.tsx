'use client'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { caller } from '@/app/_trpc/server'
import { BadgeCent, NotepadText, Server } from 'lucide-react'
import UserServers from './userservers'
import ServerPlans from './server-plans'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const DashboardTabs = ({ initialData }: {
    initialData: Awaited<ReturnType<(typeof caller['dashboard']['getDashboardData'])>>
}) => {

    const router = useRouter()

    const session = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/auth')
        },
    })

    return (
        <div className='pt-24 md:pt-10'>
            <Tabs defaultValue="servers" className="w-full flex flex-col items-center">
                <TabsList className="grid w-full max-w-[500px] grid-cols-3">
                    <TabsTrigger value="servers" className='flex items-center gap-2'>
                        <div className='hidden sm:block'>Servers</div>
                        <Server size={18} />
                    </TabsTrigger>
                    <TabsTrigger value="plans" className='flex items-center gap-2'>
                        <div className='hidden sm:block'>Plans</div>
                        <NotepadText size={18} />
                    </TabsTrigger>
                    <TabsTrigger value="credits" className='flex items-center gap-2'>
                        <div className='hidden sm:block'>Credits</div>
                        <BadgeCent size={18} />
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="servers" className='w-full flex justify-center'>
                    <UserServers initialData={initialData} />
                </TabsContent>
                <TabsContent value="plans">
                    <ServerPlans eggs={initialData.eggs} />
                </TabsContent>
                <TabsContent value="credits">
                    Credits..
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default DashboardTabs