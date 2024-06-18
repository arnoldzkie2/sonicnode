import { trpc } from '@/app/_trpc/client'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axios from 'axios'
import { LoaderCircle } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface ConfirmOrderProps {
    orderFormData: {
        amount: string;
        method: string;
        status: number;
        price: string;
        currency: string;
        receipt: string;
    }
    formBack: () => void
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    clearForm: () => void
}

const ConfirmOrder = ({ orderFormData, formBack, setOpen, clearForm }: ConfirmOrderProps) => {

    const [confirmed, setConfirmed] = useState(false)
    const [showReceipt, setShowReceipt] = useState(false)

    const { isPending, mutateAsync } = trpc.order.createOrder.useMutation({
        onError: async (err) => {

            await axios.delete('/api/uploadthing', {
                data: {
                    url: orderFormData.receipt
                }
            })
            
            clearForm()
            setOpen(false)
            return toast.error(err.message)
        },
        onSuccess: () => {
            clearForm()
            setOpen(false)
            window.location.reload()
            return toast.success("Success! order created.")
        }
    })

    return (
        <>
            <div className='flex flex-col gap-2 border-b pb-2'>
                <h1 className='text-xl'>Confirm details to buy sonic</h1>
                <small className='text-muted-foreground'>Please check if the information is correct.</small>
            </div>
            <div className='space-y-4'>
                <div className='space-y-2'>
                    <Label>Price</Label>
                    <Input readOnly value={orderFormData.price} />
                </div>
                <div className='flex items-center gap-5 w-full'>
                    <div className='space-y-2 w-full'>
                        <Label>Payment Method</Label>
                        <Input readOnly value={orderFormData.method} />
                    </div>
                    <div className='space-y-2 w-1/2'>
                        <Label>Currency</Label>
                        <Input readOnly value={orderFormData.currency} />
                    </div>
                </div>
                <div className='flex items-center justify-between w-full'>
                    <Label className='text-base'>Receipt Uploaded:</Label>
                    <Button onClick={() => setShowReceipt(prev => !prev)}>{showReceipt ? "Hide Receipt" : 'Show Receipt'}</Button>
                </div>
                {showReceipt && <Image src={orderFormData.receipt} width={300} height={300} className='w-full h-auto' alt='Uploaded Receipt' />}
                <div className='flex w-full items-center gap-3 pt-5 border-t '>
                    <Checkbox className='w-6 h-6' checked={confirmed} onCheckedChange={() => setConfirmed(prev => !prev)} id='confirmed' />
                    <Label htmlFor='confirmed' className='text-muted-foreground font-normal'>I confirm that the information provided is accurate.</Label>
                </div>
                <div className='flex w-full items-center gap-5'>
                    <Button onClick={formBack} variant={'ghost'} className='w-full'>Back</Button>
                    <Button onClick={async (e: React.MouseEvent) => {
                        e.preventDefault()
                        if(!confirmed) return toast.error("Please confirm if the information provided is correct.")
                        await mutateAsync({
                            receipt: orderFormData.receipt,
                            price: orderFormData.price,
                            currency: orderFormData.currency,
                            method: orderFormData.method
                        })
                    }} disabled={isPending} className='w-full'>{isPending ? <LoaderCircle size={20} className='animate-spin' /> : "Create Order"}</Button>
                </div>
            </div>
        </>
    )
}

export default ConfirmOrder