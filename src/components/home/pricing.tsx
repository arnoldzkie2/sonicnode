'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Cpu, GitFork, HardDrive, MemoryStick, Minus, Play, Plus, ShoppingCart, StepForward, Users, Wifi } from 'lucide-react'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Slider } from '../ui/slider'
import { Separator } from '../ui/separator'
import Image from 'next/image'

const Pricing = () => {

    const planName = [
        { name: 'Coal', desc: 'Ideal for starting small Bedrock servers, offering essential features.' },
        { name: 'Iron', desc: 'Designed for growing Java and Bedrock communities, providing enhanced performance and capabilities.' },
        { name: 'Gold', desc: 'Tailored for established Java and Bedrock servers, delivering robust features and reliable performance.' },
        { name: 'Lapiz', desc: 'Optimized for large crossplay networks (Java and Bedrock), with advanced features and excellent performance.' },
        { name: 'Diamond', desc: 'The ultimate selection for top-tier crossplay servers (Java and Bedrock), offering premium features and unmatched performance.' },
    ];

    const [selectedPlan, setSelectedPlan] = useState(2)

    const serverPlan = {
        cpu: 50,
        ram: 2,
        disk: 10,
        player: 4,
        port: 1,
        price: 175
    }

    return (
        <div className='flex flex-col gap-10 lg:gap-20 lg:flex-row w-full lg:justify-center items-center lg:items-start' id='plans'>
            <div className='flex flex-col gap-5 w-full lg:w-1/2 xl:w-2/5'>
                <h1 className='text-3xl font-[1000]'>Configure: Minecraft Server</h1>
                <Card className='w-full'>
                    <CardContent className='flex flex-col gap-3 pt-4'>
                        <Label className='text-muted-foreground text-base'>Server Specifications:</Label>
                        <div className='flex justify-between w-full'>
                            <div className='flex flex-col w-full gap-2'>
                                <div className='flex items-center gap-2'>
                                    <Cpu size={20} />
                                    <p className='text-muted-foreground'>AMD EPYC™ 7543P</p>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <MemoryStick size={20} />
                                    <p className='text-muted-foreground'>DDR4 3200MHZ</p>
                                </div>
                            </div>
                            <div className='flex flex-col w-full gap-2'>

                                <div className='flex items-center gap-2'>
                                    <HardDrive size={20} />
                                    <p className='text-muted-foreground'>NVMe SSD</p>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Wifi size={20} />
                                    <p className='text-muted-foreground'>Unlimited Bandwidth</p>
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div className='flex w-full items-center'>
                            <Image alt='Plan Image' width={60} height={60} className='mr-10' src={`/ores/${planName[selectedPlan - 1].name.toLocaleLowerCase()}.png`} />
                            <h1 className='uppercase text-3xl font-[1000]'>{planName[selectedPlan - 1].name}</h1>
                        </div>
                        <p className='text-muted-foreground'>{planName[selectedPlan - 1].desc}</p>
                        <Slider max={5} min={1} step={1} defaultValue={[selectedPlan]} onValueChange={(val) => setSelectedPlan(val[0])} />
                        <div className='w-full flex items-center justify-between'>
                            <Button className='h-7' variant={'secondary'} onClick={() => setSelectedPlan(prev => prev - 1)}>
                                <Minus />
                            </Button>
                            <Button className='h-7' onClick={() => setSelectedPlan(prev => prev + 1)}>
                                <Plus />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className='w-full lg:w-2/5 xl:w-1/3'>
                <Card className='w-full'>
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className='w-full space-y-2'>
                        <Separator />
                        <div className='w-full flex pt-2 items-center justify-between text-muted-foreground'>
                            <div className='flex items-center gap-2'>
                                <Cpu className='text-foreground' size={18} />
                                Cpu Power
                            </div>
                            <div>{serverPlan.cpu * selectedPlan}%</div>
                        </div>
                        <div className='w-full flex items-center justify-between text-muted-foreground'>
                            <div className='flex items-center gap-2'>
                                <MemoryStick className='text-foreground' size={18} />
                                DDR4 Ram
                            </div>
                            <div>{serverPlan.ram * selectedPlan}GB</div>
                        </div>
                        <div className='w-full flex items-center justify-between text-muted-foreground'>
                            <div className='flex items-center gap-2'>
                                <HardDrive className='text-foreground' size={18} />
                                NVMe Disk
                            </div>
                            <div>{serverPlan.disk * selectedPlan}GB</div>
                        </div>
                        <div className='w-full flex items-center justify-between text-muted-foreground'>
                            <div className='flex items-center gap-2'>
                                <Users className='text-foreground' size={18} />
                                Player Slot
                            </div>
                            <div>{serverPlan.player * selectedPlan}+</div>
                        </div>
                        <div className='w-full pb-2 flex items-center justify-between text-muted-foreground'>
                            <div className='flex items-center gap-2'>
                                <GitFork className='text-foreground' size={18} />
                                Max Ports
                            </div>
                            <div>{serverPlan.port * selectedPlan}</div>
                        </div>
                        <Separator />
                        <div className='w-full flex items-end justify-between'>
                            <div className='flex flex-col gap-1'>
                                <div className='pt-2 text-muted-foreground'>Server Cost</div>
                                <div className='text-foreground font-[1000] text-3xl'>
                                    ₱{serverPlan.price * selectedPlan}/<span className='text-muted-foreground text-lg font-bold'>30D</span>
                                </div>
                            </div>
                            <Button className='w-44 font-black p-0 text-lg h-14'>
                                Create Now!
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Pricing