import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { caller } from '@/app/_trpc/server'
import { Server, ShoppingCart } from 'lucide-react'
import UserData from './userdata'
import ServerPlans from './server-plans'

const DashboardTabs = ({ initialData }: {
    initialData: Awaited<ReturnType<(typeof caller['dashboard']['getDashboardData'])>>
}) => {

    return (
        <div className='py-24 md:pt-10'>
            <Tabs defaultValue="servers" className="w-full flex flex-col items-center">
                <TabsList className="grid w-full max-w-[500px] grid-cols-2">
                    <TabsTrigger value="servers" className='flex items-center gap-2'>
                        <div>Servers</div>
                        <Server size={18} />
                    </TabsTrigger>
                    <TabsTrigger value="plans" className='flex items-center gap-2'>
                        <div>Plans</div>
                        <ShoppingCart size={18} />
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="servers" className='w-full flex justify-center'>
                    <UserData initialData={initialData} />
                </TabsContent>
                <TabsContent value="plans" className='w-full'>
                    <ServerPlans eggs={initialData.eggs} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default DashboardTabs