'use client'
import { trpc } from '@/app/_trpc/client'
import { LoaderCircle } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'

const RenewServer = ({ serverID }: { serverID: number }) => {

    const { isPending, mutateAsync } = trpc.server.renewServer.useMutation({
        onError: (err) => {
            toast.error(err.message)
        },
        onSuccess: () => {
            toast.success("Success! server renewed, refresh page to see changes.")
        }
    })

    return (
        <Button className='w-full' onClick={async (e) => {
            e.preventDefault()
            await mutateAsync(serverID)
        }}>
            {isPending ? <LoaderCircle className='animate-spin' size={16} /> : "Renew"}
        </Button>
    )
}

export default RenewServer