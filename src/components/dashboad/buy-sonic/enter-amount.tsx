import { trpc } from '@/app/_trpc/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoaderCircle } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

interface EnterAmountProps {
    handleFormData: (e: React.ChangeEvent<HTMLInputElement>) => void
    setOrderFormData: React.Dispatch<React.SetStateAction<{
        amount: string;
        status: number;

    }>>
    orderFormData: {
        amount: string;
        status: number;

    }
    closeOrder: () => void
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}


const EnterAmount = ({ orderFormData, handleFormData, closeOrder, setOpen }: EnterAmountProps) => {

    const createOrderLink = trpc.order.createOrder.useMutation({
        onSuccess: (data) => {
            setOpen(false)
            window.open(data, '_blank')
        },
        onError: (err) => {
            return toast.error(err.message)
        }
    })

    const buySonic = async () => {

        if (!orderFormData.amount) return
        // const { price, method, currency } = orderFormData

        if (!orderFormData.amount || isNaN(Number(orderFormData.amount))) {
            return toast.error("Enter a valid amount");
        }
        if (Number(orderFormData.amount) < 100) {
            return toast.error("Minimum sonic purchase is 100")
        }

        createOrderLink.mutateAsync({
            amount: Number(orderFormData.amount)
        })
    }

    return (
        <>
            <div className='flex flex-col gap-2 border-b pb-2'>
                <h1 className='text-xl'>Enter amount to buy sonic</h1>
                <small className='text-muted-foreground'>Simply write down how much sonic coin you wanna buy.</small>
            </div>
            <div className='space-y-4'>

                <div className='space-y-2'>
                    <Label>Amount</Label>
                    <Input type='number' value={orderFormData.amount} onChange={handleFormData} name='amount' placeholder='₱1 = 1 Sonic' />
                    <small className='text-muted-foreground'>Minimum: 100 Sonic</small>
                </div>
                <div className='pt-5 border-t flex w-full items-center gap-5'>
                    <Button onClick={closeOrder} variant={'ghost'} className='w-full'>Close</Button>
                    <Button disabled={createOrderLink.isPending} className='w-full' onClick={buySonic}>{createOrderLink.isPending ? <LoaderCircle size={16} className='animate-spin' /> : "Buy Sonic"}</Button>
                </div>
            </div>
        </>
    )
}

export default EnterAmount