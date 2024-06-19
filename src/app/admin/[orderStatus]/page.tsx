import { caller } from '@/app/_trpc/server'
import OrderTable from '@/components/admin/order-table'
import SelectStatus from '@/components/admin/select-status'
import DashboardHeader from '@/components/dashboad/header'
import { getAuth } from '@/lib/nextauth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

interface AdminProps {
    params: {
        orderStatus: string
    }
}

const AdminPage = async ({ params }: AdminProps) => {

    cookies()
    const session = await getAuth()
    if (!session || !session.user.root_admin) redirect('/dashboard')

    const orders = await caller.order.getAllOrders({
        status: params.orderStatus
    })

    return (
        <div className='px-5 sm:px-10 md:container'>
            <DashboardHeader />
            <div className='pt-14 w-full flex justify-center'>
                <div className='flex flex-col w-full max-w-[1000px] gap-3'>
                    <SelectStatus status={params.orderStatus} />
                    <OrderTable orders={orders} />
                </div>
            </div>
        </div>
    )
}

export default AdminPage