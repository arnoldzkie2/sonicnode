'use client'
import React from 'react'
import { LogInIcon } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Button } from '../ui/button'

const LogoutButton = () => {

    return (
        <>
            <Button className='md:flex items-center gap-2' variant={'outline'} onClick={() => signOut({
                redirect: true,
                callbackUrl: '/'
            })}>
                <div className='hidden md:flex'>
                    Logout
                </div>
                <LogInIcon size={20} />
            </Button>
        </>
    )
}

export default LogoutButton