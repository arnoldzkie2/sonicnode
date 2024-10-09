'use client'
import React from 'react'
import { LogInIcon } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from '../ui/button'

const LogoutButton = () => {

    const session = useSession({
        required: true
    })

    return (
        <>
            <Button className='md:flex items-center gap-2' variant={'outline'} onClick={() => signOut({ redirect: false })}>
                <div className='hidden md:flex'>
                    Logout
                </div>
                <LogInIcon size={20} />
            </Button>
        </>
    )
}

export default LogoutButton