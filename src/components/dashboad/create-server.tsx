'use client'
import React, { useState } from 'react'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { LoaderCircle, ShoppingCart } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Separator } from '../ui/separator'
import { trpc } from '@/app/_trpc/client'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { toast } from 'sonner'

const CreateServer = ({ eggs, planID }: {
    eggs: {
        name: string
        id: number
    }[] | undefined
    planID: number
}) => {

    const [open, setOpen] = useState(false)

    const [serverFormData, setServerFormData] = useState({
        planID: 0,
        name: '',
        egg: '',
        description: ''
    })

    const userServers = trpc.server.getUserServers.useQuery(undefined, {
        refetchOnMount: false,
    })

    const createServer = trpc.server.createServer.useMutation({
        onError: (err) => {
            toast.error(err.message, {
                position: 'bottom-center'
            })
        },
        onSuccess: async () => {
            userServers.refetch()
            toast.success("Success! server created.", {
                position: 'bottom-center'
            })
            setOpen(false)

            // Function to refetch 10 times every 10 seconds
            let refetchCount = 0;
            const intervalId = setInterval(() => {
                if (refetchCount < 6) {
                    userServers.refetch();
                    refetchCount++;
                } else {
                    clearInterval(intervalId);
                }
            }, 10000); // 10000 milliseconds = 10 seconds
        }
    })

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild onClick={() => setServerFormData(prev => ({
                ...prev,
                planID
            }))}>
                <Button className='rounded-full w-[55px] h-[55px] bg-muted text-foreground hover:text-white'>
                    <ShoppingCart size={25} />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='w-full max-w-96'>
                <AlertDialogHeader>
                    <AlertDialogTitle>Create a server</AlertDialogTitle>
                    <AlertDialogDescription>
                        Set up your own Minecraft world to play with friends. Customize settings and manage your server easily.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Separator />
                <form className='flex flex-col space-y-4' onSubmit={async (e) => {
                    e.preventDefault()
                    const data = { ...serverFormData, egg: Number(serverFormData.egg) }
                    await createServer.mutateAsync(data)
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
                    <div className='flex flex-col space-y-2'>
                        <Label>Server Name</Label>
                        <Input required value={serverFormData.name} onChange={(e) => setServerFormData(prev => ({ ...prev, name: e.target.value }))} />
                    </div>
                    <div className='flex flex-col space-y-2'>
                        <Label>Server Description (optional)</Label>
                        <Input value={serverFormData.description} onChange={(e) => setServerFormData(prev => ({ ...prev, description: e.target.value }))} />
                    </div>

                    <div className='flex items-center gap-5 w-full pt-4'>
                        <Button onClick={() => setOpen(false)} variant={'ghost'} type='button' className='w-full'>Close</Button>
                        <Button disabled={createServer.isPending} className='w-full'>{
                            createServer.isPending ? <LoaderCircle size={16} className='animate-spin' /> : 'Create'
                        }</Button>
                    </div>
                </form>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export default CreateServer