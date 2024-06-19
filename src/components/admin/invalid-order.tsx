import React, { useState } from 'react'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import Image from 'next/image'
import { users_orders } from '@prisma/client'
import { trpc } from '@/app/_trpc/client'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { LoaderCircle } from 'lucide-react'

const InvalidOrder = ({ operation, order, setOperation }: {
    operation: string,
    setOperation: React.Dispatch<React.SetStateAction<string>>
    order: users_orders
}) => {

    const [showReceipt, setShowReceipt] = useState(false)
    const invalidOrder = trpc.order.invalidOrder.useMutation({
        onSuccess: () => {
            toast.success("Success!")
            setOperation('')
            window.location.reload()
        },
        onError: (err) => {
            toast.error(err.message)
        }
    })

    return (
        <AlertDialog open={operation === 'invalid' && true}>
            <AlertDialogContent className='w-full max-w-96 max-h-[650px] overflow-y-auto'>
                <AlertDialogHeader>
                    <AlertDialogTitle>Invalid Order</AlertDialogTitle>
                    <AlertDialogDescription>Are you sure this order is invalid?</AlertDialogDescription>
                </AlertDialogHeader>
                <div className='space-y-4'>
                    <div className='space-y-2'>
                        <Label>Price</Label>
                        <Input readOnly value={order.price} />
                    </div>
                    <div className='flex items-center gap-5 w-full'>
                        <div className='space-y-2 w-full'>
                            <Label>Payment Method</Label>
                            <Input readOnly value={order.method} />
                        </div>
                        <div className='space-y-2 w-1/2'>
                            <Label>Currency</Label>
                            <Input readOnly value={order.currency} />
                        </div>
                    </div>
                    <div className='flex items-center justify-between w-full'>
                        <Label className='text-base'>Receipt Uploaded:</Label>
                        <Button variant={'secondary'} onClick={() => setShowReceipt(prev => !prev)}>{showReceipt ? "Hide Receipt" : 'Show Receipt'}</Button>
                    </div>
                    {showReceipt && <Image src={order.receipt} width={300} height={300} className='w-full h-auto' alt='Uploaded Receipt' />}
                    <div className='flex w-full items-center gap-5'>
                        <AlertDialogCancel className='w-full' onClick={() => setOperation('')}>
                            Close
                        </AlertDialogCancel>
                        <Button onClick={async (e: React.MouseEvent) => {
                            e.preventDefault()
                            invalidOrder.mutateAsync(order.id)
                        }} disabled={invalidOrder.isPending} className='w-full'>{invalidOrder.isPending ? <LoaderCircle size={20} className='animate-spin' /> : "Invalid Order"}</Button>
                    </div>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default InvalidOrder