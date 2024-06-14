import { PLANS } from '@/constant/plans'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Cpu,  HardDrive, MemoryStick, Server, ShoppingCart, Users } from 'lucide-react'
import { Label } from '../ui/label'
import ReturnToolTip from '../ui/return-tooltip'
import { Button } from '../ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '../ui/dropdown-menu'

const Pricing = () => {
    return (
        <div className='flex flex-col gap-10 py-16'>
            <h1 className='text-3xl md:text-4xl font-[1000] self-center'>Explore Our Plans:</h1>
            <div className='flex flex-wrap gap-5 md:gap-10 justify-center'>
                {PLANS.map((plans, i) => (
                    <Card key={i} className='w-full max-w-80 cursor-pointer hover:shadow-2xl hover:rounded-2xl hover:shadow-yellow-400 hover:scale-[101%] transition-all'>
                        <CardHeader>
                            <CardTitle className='flex items-center justify-between w-full'>
                                <div className='flex flex-col gap-1'>
                                    <div className='text-muted-foreground text-base'>{plans.name.toUpperCase()}</div>
                                    <ReturnToolTip
                                        trigger={<h1 className='font-[1000]'>{plans.ram}MB</h1>}
                                        content='Dedicated High Speed RAM'
                                    />
                                </div>
                                <Image src={`/ores/${plans.name.toLowerCase()}.png`} alt='Ores' width={70} height={70} />
                            </CardTitle>
                            <CardDescription>{plans.description}</CardDescription>
                        </CardHeader>
                        <CardContent className='flex flex-col gap-3 text-muted-foreground'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2'>
                                    <ReturnToolTip
                                        trigger={<Users size={20} />}
                                        content="Recommended player slots"
                                    />
                                    <Label className='text-foreground'>{plans.players}+ Players</Label>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <ReturnToolTip
                                        trigger={<HardDrive size={20} />}
                                        content='NVMe Storage (2 GB/s Write, 7 GB/s Read)'
                                    />
                                    <Label className='text-foreground'>{plans.disk}</Label>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <ReturnToolTip
                                        trigger={<Server size={20} />}
                                        content='Available Server Slots'
                                    />
                                    <Label className='text-foreground font-black'>{plans.serverSlots}</Label>
                                </div>
                            </div>
                            <div className='flex flex-col gap-1.5'>
                                <div className='flex items-center gap-2 '>
                                    <ReturnToolTip
                                        trigger={<Cpu size={20} className='text-foreground' />}
                                        content="Cpu Power Available"
                                    />
                                    <Label>Cpu Power: {plans.cpu}</Label>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <ReturnToolTip
                                        trigger={<MemoryStick size={20} className='text-foreground' />}
                                        content='Uses your disk as additional memory to ensure server stability during peak usage.'
                                    />
                                    <Label>Swap Disk: {plans.vram}MB</Label>
                                </div>
                            </div>
                            <div className='flex items-end w-full justify-between pt-2 border-t'>
                                <div className='flex flex-col gap-1.5'>
                                    <Label className='text-muted-foreground'>Server cost {'->'}</Label>
                                    <h1 className='text-foreground font-[1000] text-2xl'>${plans.price}/mo</h1>
                                </div>
                                <ReturnToolTip
                                    trigger={
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button className='rounded-full w-[55px] h-[55px] bg-muted text-foreground hover:text-white'>
                                                    <ShoppingCart size={25} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className='w-full max-w-80'>
                                                <DropdownMenuLabel>Payment Method</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <Link href={plans.payments.paypal} target='_blank'>
                                                    <DropdownMenuItem>
                                                        Paypal
                                                        <DropdownMenuShortcut>
                                                            <Image src={'/payments/paypal.svg'} alt='Paypal' width={20} height={20} className='bg-white w-6 h-6 dark:w-5 dark:h-5 rounded-full p-0.5' />
                                                        </DropdownMenuShortcut>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem>
                                                    <Link href={'/payments/gcash.jpg'} target='_blank'>
                                                        GCash
                                                    </Link>
                                                    <DropdownMenuShortcut>
                                                        <Image src={'/payments/gcash.svg'} alt='Gcash' width={20} height={20} className='bg-white w-6 h-6 dark:w-5 dark:h-5 rounded-full p-0.5' />
                                                    </DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    Cypto
                                                    <DropdownMenuShortcut>
                                                        <Image src={'/payments/crypto.svg'} alt='Crypto' width={20} height={20} className='bg-white w-6 h-6 dark:w-5 dark:h-5 rounded-full p-0.5' />
                                                    </DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    }
                                    content='Subscribe Now'
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default Pricing