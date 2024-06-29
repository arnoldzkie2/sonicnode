import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { ChevronsRight, Cpu, GitFork, HardDrive, Play, ShoppingCart, StepForward, Users } from 'lucide-react'
import { Label } from '../ui/label'
import ReturnToolTip from '../ui/return-tooltip'
import { Button } from '../ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { caller } from '@/app/_trpc/server'

const Pricing = async () => {

    const plans = await caller.server_plans.getAll()

    return (
        <div className='flex flex-col' id='plans'>
            <div className='flex flex-wrap gap-5 justify-center'>
                {plans.map((plans, i) => (
                    <Card key={i} className='w-[100%] sm:w-72 cursor-pointer hover:shadow-2xl hover:rounded-2xl hover:shadow-yellow-400 hover:scale-[101%] transition-all'>
                        <CardHeader className='py-4'>
                            <CardTitle className='flex items-center justify-between w-full'>
                                <div className='flex flex-col gap-1'>
                                    <div className='text-muted-foreground text-base'>{plans.name.toUpperCase()}</div>
                                    <ReturnToolTip
                                        trigger={<h1 className='font-[1000] text-primary'>{plans.ram}MB</h1>}
                                        content='Dedicated High Speed RAM'
                                    />
                                </div>
                                <Image src={`/ores/${plans.name.toLowerCase()}.png`} alt='Ores' width={55} height={55} />
                            </CardTitle>
                            <CardDescription>{plans.description}</CardDescription>
                        </CardHeader>
                        <CardContent className='flex flex-col gap-2 text-muted-foreground'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2'>
                                    <ReturnToolTip
                                        trigger={<HardDrive className='text-foreground' size={20} />}
                                        content='NVMe Storage (2 GB/s Write, 7 GB/s Read)'
                                    />
                                    <Label className='text-muted-foreground'>NVMe Disk: {plans.disk}GB</Label>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <ReturnToolTip
                                        trigger={<Users size={20} className='text-foreground' />}
                                        content="Recommended player slots"
                                    />
                                    <Label className='w-6'>{plans.players}+</Label>
                                </div>

                            </div>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2 '>
                                    <ReturnToolTip
                                        trigger={<Cpu size={20} className='text-foreground' />}
                                        content="Cpu Power Available"
                                    />
                                    <Label>Cpu: {plans.cpu}% (3.2GHz)</Label>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <ReturnToolTip
                                        trigger={<GitFork size={20} className='text-foreground' />}
                                        content="Dedicated Ports"
                                    />
                                    <Label className='w-6'>5</Label>
                                </div>
                            </div>
                            <div className='flex items-end w-full justify-between pt-2 border-t'>
                                <div className='flex flex-col gap-1'>
                                    <Label className='text-muted-foreground'>Server cost {'->'}</Label>
                                    <div className='text-foreground flex items-center font-[1000] border-b-2 border-yellow-400 text-2xl'>
                                        <ReturnToolTip
                                            trigger={
                                                <div>
                                                    ₱
                                                </div>
                                            }
                                            content='Sonic Coin ₱1 = 1 Sonic Coin'
                                        />
                                        {plans.price}/<span className='text-sm pt-1.5 text-muted-foreground'>30D</span>
                                    </div>
                                </div>
                                <Link href={'/dashboard'}>
                                    <Button className='rounded-full w-[50px] h-[50px] p-0 bg-muted text-foreground hover:text-white'>
                                        <ChevronsRight size={25} />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default Pricing