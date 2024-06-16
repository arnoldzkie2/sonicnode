'use client'
import { signOut } from 'next-auth/react'
import React from 'react'
const Dashboard = () => {
    return (
        <div className='flex flex-col' onClick={() => signOut({
            redirect: true,
            callbackUrl: '/'
        })}>
            Logout
        </div>
    )
}

export default Dashboard