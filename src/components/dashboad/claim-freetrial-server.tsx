'use client'
import React, { useState } from 'react'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { LoaderCircle } from 'lucide-react'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import { trpc } from '@/app/_trpc/client'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { toast } from 'sonner'

const ClaimFreeTrial = ({ eggs, trigger }: {
    eggs: {
        name: string
        id: number
    }[]
    trigger: any
}) => {

    const [open, setOpen] = useState(false)

    const [serverFormData, setServerFormData] = useState({
        egg: '',
    })

    const userServers = trpc.server.getUserServers.useQuery(undefined, {
        refetchOnMount: false,
    })
    const trialClaimed = trpc.user.checkFreeTrialClaimed.useQuery(undefined, {
        initialData: false,
        refetchOnMount: false
    })


    const createFreeTrial = trpc.server.createFreeTrialServer.useMutation({
        onError: (err) => {
            toast.error(err.message, {
                position: 'bottom-center'
            })
        },
        onSuccess: async () => {
            await Promise.all([
                trialClaimed.refetch(),
                userServers.refetch()
            ])
            toast.success("Success! server created.", {
                position: 'bottom-center'
            })
            setOpen(false)
        }
    })

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild onClick={() => setServerFormData(prev => ({
                ...prev,
            }))}>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent className='w-full max-w-96'>
                <AlertDialogHeader>
                    <AlertDialogTitle>Create free trial server</AlertDialogTitle>
                    <AlertDialogDescription>
                        Set up your own Minecraft world to play with friends. Customize settings and manage your server easily.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Separator />
                <form className='flex flex-col space-y-4' onSubmit={async (e) => {
                    e.preventDefault()
                    const data = { ...serverFormData, egg: Number(serverFormData.egg) }
                    await createFreeTrial.mutateAsync(data)
                }}>
                    <div className='flex flex-col space-y-3'>
                        <Label>Server Type</Label>
                        <Select value={serverFormData.egg} onValueChange={(val) => setServerFormData(prev => ({ ...prev, egg: val }))}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a server" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {eggs && eggs.length && eggs.map(egg => (
                                        <SelectItem key={egg.id} value={String(egg.id)}>{egg.name}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='flex items-center gap-5 w-full pt-4'>
                        <Button onClick={() => setOpen(false)} variant={'ghost'} type='button' className='w-full'>Close</Button>
                        <Button disabled={createFreeTrial.isPending} className='w-full'>
                            {
                                createFreeTrial.isPending ? <LoaderCircle size={16} className='animate-spin' /> : 'Claim'
                            }
                        </Button>
                    </div>
                </form>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export default ClaimFreeTrial