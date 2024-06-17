import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'

interface UserCreditProps {
    credits: number,
    totalMonthlyBilling: number
}

const UserCredits = ({ credits, totalMonthlyBilling }: UserCreditProps) => {

    return (
        <div className='flex flex-col gap-5 py-8 w-full items-center'>
            <div className='flex flex-col border rounded-md gap-3 w-full max-w-[500px] p-5'>
                <div className='flex items-center justify-between w-full'>
                    <h1 className='text-lg'>Remaining Balance</h1>
                    <Button className='h-8'>Buy Sonic</Button>
                </div>
                <div className='flex items-center w-full justify-between'>
                    <div className='flex items-center gap-3'>
                        <Image src={'/logo.svg'} alt='Sonic Coin' width={30} height={30} />
                        <h1 className='text-2xl font-[1000]'>{credits}</h1>
                    </div>
                    <small className='text-muted-foreground'>$1 = 100 Sonic Coin</small>
                </div>
                <Separator />
                <div className='flex items-center justify-between w-full'>
                    <small className='text-muted-foreground'>Total Monthly Billing</small>
                    <div className='flex items-center gap-3'>
                        <Image src={'/logo.svg'} alt='Sonic Coin' width={23} height={23} />
                        <div className='text-sm font-[1000] text-muted-foreground'>{totalMonthlyBilling}/30D</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserCredits