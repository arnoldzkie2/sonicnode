import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UploadButton } from '@/lib/utils';
import { CircleCheck } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react'
import { toast } from 'sonner';

interface ScanQrProps {
    orderFormData: {
        amount: string;
        method: string;
        status: number;
        price: string;
        currency: string;
        receipt: string;
    }
    setOrderFormData: React.Dispatch<React.SetStateAction<{
        amount: string;
        method: string;
        status: number;
        price: string;
        currency: string;
        receipt: string;
    }>>
    formBack: () => void
}

const ScanQr = ({ orderFormData, formBack, setOrderFormData }: ScanQrProps) => {

    const [showQr, setShowQr] = useState(true)

    const continueConfirm = () => {
        const { receipt } = orderFormData
        if (!receipt) return toast.error("Receipt is required!")
        setOrderFormData(prev => ({ ...prev, status: 3 }))
    }

    return (
        <>
            <div className='flex flex-col gap-2 border-b pb-2'>
                <h1 className='text-xl'>Step 2 to buy sonic</h1>
                <small className='text-muted-foreground'>Scan Qr Code and upload receipt.</small>
            </div>
            <div className='flex items-center gap-5 w-full '>
                <Button onClick={() => setShowQr(prev => !prev)} className='w-full'>{showQr ? "Hide QR" : "Show QR"}</Button>
                <a href={`/payments/qr/${orderFormData.method.toLowerCase()}.png`} download={`sonic-qr-${orderFormData.method}.png`} className='w-full'>
                    <Button className='w-full' variant={'link'}>Download QR</Button>
                </a>
            </div>
            {showQr && <Image src={`/payments/qr/${orderFormData.method.toLocaleLowerCase()}.png`} alt='Qr Code' width={300} height={300} className='w-full h-auto' />}
            <div className='flex w-full gap-3 items-center'>
                <Label>Upload Receipt: </Label>
                <UploadButton
                    endpoint='receiptUploader'
                    appearance={{
                        button: 'bg-muted text-foreground border border-black',
                        allowedContent: 'hidden'
                    }}
                    onClientUploadComplete={(data) => {
                        setOrderFormData(prev => ({ ...prev, receipt: data[0].url }))
                        toast.success("Success! receipt uploaded.")
                        console.log(data)
                    }}
                    onUploadError={(err) => {
                        toast.error("Something went wrong while uploading receipt.")
                        console.log(err)
                    }}
                />
                {orderFormData.receipt && <CircleCheck className='text-primary' size={30} />}
            </div>
            <div className='flex items-center w-full gap-5 pt-5 border-t'>
                <Button className='w-full' variant={'ghost'} onClick={formBack}>Back</Button>
                <Button className='w-full' onClick={continueConfirm}>Continue</Button>
            </div>
        </>
    )
}

export default ScanQr