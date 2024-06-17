import { caller } from '@/app/_trpc/server'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import Link from 'next/link'
import { Button } from '../ui/button'
import { Cpu, HardDrive, LogIn, MemoryStick } from 'lucide-react'
import ReturnToolTip from '../ui/return-tooltip'
import Image from 'next/image'

interface Props {
    initialData: Awaited<ReturnType<(typeof caller['dashboard']['getDashboardData'])>>
}

const UserServers = ({ initialData }: Props) => {

    const { servers } = initialData

    return (
        <div className='flex pt-5 flex-col gap-2 w-full max-w-[500px]'>
            <div className='border-b pb-3 mb-3 flex items-center gap-5 w-full justify-between'>
                <Label className='text-base'>{"Total: "} {servers.length}</Label>
                <Link href={process.env.NEXT_PUBLIC_APP_URL as string || '/'}>
                    <Button className='flex items-center gap-2'>
                        <div>Panel</div>
                        <LogIn size={16} />
                    </Button>
                </Link>
            </div>
            <div className='flex flex-wrap w-full gap-10'>
                {
                    servers.length > 0 && servers.map((server, i) => (
                        <Card key={i} className='w-full'>
                            <CardHeader>
                                <CardTitle>{server.name}</CardTitle>
                            </CardHeader>
                            <CardContent className='flex flex-col gap-2 text-muted-foreground'>
                                <div className='flex w-full justify-between'>
                                    <div className='flex items-center gap-2'>
                                        <ReturnToolTip
                                            trigger={<MemoryStick className='text-foreground' size={20} />}
                                            content='Dedicated Fast Memory Speed'
                                        />
                                        <Label className='text-muted-foreground'>Ram: {server.memory}MB</Label>
                                    </div>
                                    <div className='flex items-center gap-2 '>
                                        <ReturnToolTip
                                            trigger={<Cpu size={20} className='text-foreground' />}
                                            content="Cpu Power Available"
                                        />
                                        <Label>{server.cpu}%</Label>
                                    </div>
                                </div>
                                <div className='flex w-full justify-between'>
                                    <div className='flex items-center gap-2'>
                                        <ReturnToolTip
                                            trigger={<HardDrive className='text-foreground' size={20} />}
                                            content='NVMe Storage (2 GB/s Write, 7 GB/s Read)'
                                        />
                                        <Label className='text-muted-foreground'>Disk: {server.disk}MB</Label>
                                    </div>
                                    <div className='flex items-center gap-2 w-16'>
                                        <ReturnToolTip
                                            trigger={<Image src={'/logo.svg'} alt='Sonic Coin' width={20} height={20} />}
                                            content='Server Renewal Cost'
                                        />
                                        <Label className='text-muted-foreground'>{server.renewal}/mo</Label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                }
            </div>
        </div>
    )
}

export default UserServers