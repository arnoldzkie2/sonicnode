import React from 'react'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import Link from 'next/link'

const Trial = () => {
    return (
        <div className='flex flex-col items-center pt-16 gap-10 w-full'>
            <div className='flex flex-col gap-7 text-center items-center sm:w-[70%] md:w-3/4 lg:w-2/3'>
                <Label className='text-primary text-xl'>Offering Free Trial (3DAYS)</Label>
                <h1 className='text-4xl font-[1000]'>Experience a Paid Minecraft Server For Free</h1>
                <h2 className='text-muted-foreground text-lg'>Explore our Minecraft server hosting with a free trial. Discover the advantages of reliable performance, flexible configurations, and dedicated support for your gaming community.</h2>
                <div className='flex justify-center w-full'>
                    <Link href={'/auth'}>
                        <Button className='w-full max-w-52'>Claim Free Server</Button>
                    </Link>
                </div>
            </div>
            <Separator className='hidden md:flex' />
        </div>
    )
}


export default Trial