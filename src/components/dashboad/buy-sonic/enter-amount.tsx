import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CURRENCY, PAYMENT_METHODS } from '@/constant/payment'
import React from 'react'
import { toast } from 'sonner'

interface EnterAmountProps {
    handleFormData: (e: React.ChangeEvent<HTMLInputElement>) => void
    setOrderFormData: React.Dispatch<React.SetStateAction<{
        amount: string;
        method: string;
        status: number;
        price: string;
        currency: string;
        receipt: string;
    }>>
    orderFormData: {
        amount: string;
        method: string;
        status: number;
        price: string;
        currency: string;
        receipt: string;
    }
    closeOrder: () => void
}


const EnterAmount = ({ orderFormData, setOrderFormData, handleFormData, closeOrder }: EnterAmountProps) => {

    const confirmAmount = () => {
        const { price, method, currency } = orderFormData

        if (!price || isNaN(Number(price)) || Number(price) <= 0) {
            return toast.error("Enter a valid price");
        }
        if (!method) return toast.error("Select payment method")
        if (!currency) return toast.error("Select Currency")

        setOrderFormData(prev => ({ ...prev, status: 2 }))
    }

    return (
        <>
            <div className='flex flex-col gap-2 border-b pb-2'>
                <h1 className='text-xl'>Step 1 to buy sonic</h1>
                <small className='text-muted-foreground'>Other currencies are available as well.</small>
            </div>
            <div className='space-y-4'>
                <div className='space-y-2'>
                    <Label>Price</Label>
                    <Input type='number' value={orderFormData.price} onChange={handleFormData} name='price' placeholder='$1 = 100 Sonic' />
                </div>
                <div className='flex items-center gap-5 w-full'>
                    <div className='space-y-2 w-full'>
                        <Label>Payment Method</Label>
                        <Select value={orderFormData.method} onValueChange={(val) => setOrderFormData(prev => ({ ...prev, method: val }))}>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Select Payment Method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {PAYMENT_METHODS.map((method, i) => (
                                        <SelectItem key={i} value={method}>{method}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='space-y-2 w-1/2'>
                        <Label>Currency</Label>
                        <Select value={orderFormData.currency} onValueChange={(val) => setOrderFormData(prev => ({ ...prev, currency: val }))}>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder="Currency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {CURRENCY.map((curren, i) => (
                                        <SelectItem key={i} value={curren}>{curren}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className='pt-5 border-t flex w-full items-center gap-5'>
                    <Button onClick={closeOrder} variant={'ghost'} className='w-full'>Close</Button>
                    <Button className='w-full' onClick={confirmAmount}>Continue</Button>
                </div>
            </div>
        </>
    )
}

export default EnterAmount