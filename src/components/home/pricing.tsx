'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Cpu, GitFork, HardDrive, MemoryStick, Minus, Plus, Users, Wifi } from 'lucide-react'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Slider } from '../ui/slider'
import { Separator } from '../ui/separator'
import Image from 'next/image'
import { eggs } from '@prisma/client'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from 'next/link'
import { planName, serverPlan } from '@/constant/plans'

const Pricing = ({ eggs }: { eggs: eggs[] }) => {

 
    const [selectedPlan, setSelectedPlan] = useState(2)

    return (
        <div className='flex flex-col gap-10 lg:gap-20 lg:flex-row w-full lg:justify-center items-center lg:items-start' id='plans'>
            <div className='flex flex-col gap-4 w-full lg:w-1/2 xl:w-2/5'>
                <h1 className='text-2xl sm:text-3xl font-[1000]'>Configure: Minecraft Server</h1>
                <h2 className='text-muted-foreground'>Configure the technical details for your new minecraft server.</h2>
                <Card className='w-full'>
                    <CardContent className='flex flex-col gap-2 pt-4'>
                        <Label className='text-muted-foreground text-base'>Server Specifications:</Label>
                        <div className='flex flex-col gap-2 sm:flex-row sm:justify-between w-full'>
                            <div className='flex flex-col w-full gap-2'>
                                <div className='flex items-center gap-2'>
                                    <Cpu size={20} />
                                    <p className='text-muted-foreground text-sm'>AMD EPYC™ 7543P</p>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <MemoryStick size={20} />
                                    <p className='text-muted-foreground text-sm'>DDR4 3200MHZ</p>
                                </div>
                            </div>
                            <div className='flex flex-col w-full gap-2'>

                                <div className='flex items-center gap-2'>
                                    <HardDrive size={20} />
                                    <p className='text-muted-foreground text-sm'>NVMe SSD</p>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Wifi size={20} />
                                    <p className='text-muted-foreground text-sm'>Unlimited Bandwidth</p>
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div className='flex w-full flex-col gap-3 sm:flex-row sm:items-center justify-between'>
                            <div className='w-full flex items-center order-2 sm:order-1'>
                                <Image alt='Plan Image' width={40} height={40} className='mr-5' src={`/ores/${planName[selectedPlan - 1].name.toLocaleLowerCase()}.png`} />
                                <h1 className='uppercase text-2xl font-[1000]'>{planName[selectedPlan - 1].name}</h1>
                            </div>
                            <div className='w-full flex items-center order-1 sm:order-2'>
                                <Select>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Server Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {eggs.map(type => (
                                                <SelectItem value={type.name} key={type.id}>{type.name}</SelectItem>
                                            ))}

                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <p className='text-muted-foreground text-sm'>{planName[selectedPlan - 1].desc}</p>
                        <Separator className='my-1' />
                        <Slider max={6} min={1} step={1} value={[selectedPlan]} onValueChange={(val) => setSelectedPlan(val[0])} />
                        <div className='w-full flex items-center gap-5 pt-2'>
                            <Button disabled={selectedPlan === 1} className='h-8' variant={'secondary'} onClick={() => setSelectedPlan(prev => prev - 1)}>
                                <Minus />
                            </Button>
                            <Button disabled={selectedPlan === 6} className='h-8' onClick={() => setSelectedPlan(prev => prev + 1)}>
                                <Plus />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className='w-full self-end lg:w-1/3 xl:w-1/4 2xl:w-1/5'>
                <Card className='w-full'>
                    <CardContent className='w-full space-y-2 pt-4'>
                        <div className='w-full flex items-center justify-between text-muted-foreground'>
                            <div className='flex items-center text-sm gap-2'>
                                <Cpu className='text-foreground' size={18} />
                                Cpu
                            </div>
                            <div>{serverPlan.cpu * selectedPlan}%</div>
                        </div>
                        <div className='w-full flex items-center justify-between text-muted-foreground'>
                            <div className='flex items-center text-sm gap-2'>
                                <MemoryStick className='text-foreground' size={18} />
                                Ram
                            </div>
                            <div>{serverPlan.ram * selectedPlan}GiB</div>
                        </div>
                        <div className='w-full flex items-center justify-between text-muted-foreground'>
                            <div className='flex items-center text-sm gap-2'>
                                <HardDrive className='text-foreground' size={18} />
                                Disk
                            </div>
                            <div>{serverPlan.disk * selectedPlan}GiB</div>
                        </div>
                        <div className='w-full flex items-center justify-between text-muted-foreground'>
                            <div className='flex items-center text-sm gap-2'>
                                <Users className='text-foreground' size={18} />
                                Slots
                            </div>
                            <div>{serverPlan.player * selectedPlan}+</div>
                        </div>
                        <div className='w-full pb-2 flex items-center justify-between text-muted-foreground'>
                            <div className='flex items-center text-sm gap-2'>
                                <GitFork className='text-foreground' size={18} />
                                Ports
                            </div>
                            <div>{serverPlan.port * selectedPlan}</div>
                        </div>
                        <Separator />
                        <div className='w-full flex items-center justify-between'>
                            <div className='pt-2 font-bold -mt-2 text-foreground'>PRICE:</div>
                            <div className='text-foreground font-[1000] text-2xl'>
                                ₱{serverPlan.price * selectedPlan}/<span className='text-muted-foreground text-sm'>30D</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Link href={'/auth'}>
                    <Button className='w-full mt-4'>Create Server</Button>
                </Link>
            </div>
        </div>
    )
}

export default Pricing