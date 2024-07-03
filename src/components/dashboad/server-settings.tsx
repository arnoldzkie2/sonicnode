
import { PackageMinus, PackagePlus, RefreshCcw, Settings2, SquarePen } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from '../ui/dropdown-menu'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { trpc } from '@/app/_trpc/client'
import { toast } from 'sonner'

const ServerSettings = ({ serverID, refetch }: { serverID: number, refetch: any }) => {

    const [open, setOpen] = useState(false)
    const renewServer = trpc.server.renewServer.useMutation({
        onError: (err) => {
            toast.error(err.message)
        },
        onSuccess: () => {
            toast.success("Success! server renewed.")
            refetch()
        }
    })

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                {renewServer.isPending ?
                    <Button className='h-9 px-4' variant={'secondary'}>
                        <RefreshCcw size={16} className='animate-spin' />
                    </Button> :
                    <Button variant={'secondary'} className='h-9 px-4'>
                        Settings
                        <Settings2 size={16} className='cursor-pointer ml-1.5' />
                    </Button>
                }
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={async () => {
                    setOpen(true)
                    await renewServer.mutateAsync(serverID)
                }}>
                    <span>Renew</span>
                    <DropdownMenuShortcut>
                        <RefreshCcw size={16} className={`${renewServer.isPending && "animate-spin"}`} />
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <span>Upgrade</span>
                    <DropdownMenuShortcut>
                        <PackagePlus size={16} />
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <span>Downgrade</span>
                    <DropdownMenuShortcut>
                        <PackageMinus size={16} />
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <span>Update</span>
                    <DropdownMenuShortcut>
                        <SquarePen size={16} />
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ServerSettings