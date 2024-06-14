'use client'
import React from 'react'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { CircleCheckBig, LogInIcon } from 'lucide-react'
import { Separator } from '../ui/separator'
import { FEATURES } from '@/constant/features'
import Link from 'next/link'

const Main = () => {
    return (
        <div className='flex flex-col items-center gap-10 pt-32 w-full md:h-screen'>
            <div className='flex flex-col gap-7 text-center items-center sm:w-[70%] md:w-3/4 lg:w-2/3'>
                <Label className='text-muted-foreground'>We offer free trial up to (7 DAYS)</Label>
                <h1 className='text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-[1000]'>Reliable Minecraft Server Hosting in Asia</h1>
                <h2 className='text-muted-foreground'>Discover reliable Minecraft server hosting with dedicated resources and budget-friendly prices.</h2>
                <div className='flex items-center gap-5 w-full md:w-auto'>
                    <Button className='w-full md:w-44'>Explore Our Plans</Button>
                    <Link href={'https://panel.sonicnode.xyz'} className='w-full md:w-44' target='_blank'>
                        <Button variant={'outline'} className='w-full'>Panel
                            <LogInIcon size={16} className='ml-2' />
                        </Button>
                    </Link>
                </div>
            </div>
            <Separator className='hidden md:flex' />
            <ul className='flex flex-col text-start gap-4'>
                <Label className='text-2xl md:text-center'>Key Features:</Label>
                <div className='flex flex-col md:flex-row flex-wrap md:justify-center gap-5 md:w-full xl:w-2/3 self-center md:items-center'>
                    {FEATURES.map((item, i) => (
                        <div className='flex items-center text-muted-foreground gap-3' key={i}>
                            <CircleCheckBig size={16} className='md:hidden text-foreground' />
                            <Label className='md:hidden'>
                                {item}
                            </Label>
                            <Button className='hidden md:flex' variant={'outline'}>{item}</Button>
                        </div>
                    ))}
                </div>
            </ul>
        </div>
    )
}


export default Main