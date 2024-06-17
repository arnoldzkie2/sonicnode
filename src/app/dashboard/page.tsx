import DashboardHeader from '@/components/dashboad/header'
import React from 'react'
import { caller } from '../_trpc/server'
import DashboardTabs from '@/components/dashboad/dashboard'
import { getAuth } from '@/lib/nextauth'
import { redirect } from 'next/navigation'

const Dashboard = async () => {

    const session = await getAuth()
    if (!session) redirect('/auth')
    const dashboardData = await caller.dashboard.getDashboardData()

    return (
        <div className='px-5 sm:px-10 md:container'>
            <DashboardHeader />
            <DashboardTabs initialData={dashboardData} />
        </div>
    )
}

export default Dashboard