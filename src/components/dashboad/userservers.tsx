import { caller } from '@/app/_trpc/server'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import Link from 'next/link'
import { Button } from '../ui/button'
import { Cpu, HardDrive, LogIn, MemoryStick } from 'lucide-react'
import ReturnToolTip from '../ui/return-tooltip'
import Image from 'next/image'
import { SonicInfo } from '@/server/routes/serverRoute'
import RenewServer from './renew-server'

interface Props {
    initialData: Awaited<ReturnType<(typeof caller['dashboard']['getDashboardData'])>>
}

const UserServers = ({ initialData }: Props) => {

    const { servers } = initialData

    return (
        <div className='flex pt-5 pb-10 flex-col gap-2 w-full max-w-[500px]'>
            <div className='border-b pb-3 mb-3 flex items-center gap-5 w-full justify-between'>
                <Label className='text-base'>{"Total: "} {servers.length}</Label>
                <Link href={process.env.NEXT_PUBLIC_APP_URL as string || '/'}>
                    <Button className='flex items-center gap-2'>
                        <div>Panel</div>
                        <LogIn size={16} />
                    </Button>
                </Link>
            </div>
            <div className='flex flex-wrap w-full gap-5'>
                {
                    servers.length > 0 ? servers.map((server, i) => {
                        const sonicInfo: SonicInfo = JSON.parse(server.sonic_info || "{}")
                        return (
                            <Card key={i} className='w-full'>
                                <CardHeader>
                                    <CardTitle>{server.name}</CardTitle>
                                    <CardDescription>{server.description}</CardDescription>
                                </CardHeader>
                                <CardContent className='flex flex-col gap-2 text-muted-foreground'>
                                    <div className='flex w-full justify-between'>
                                        <div className='flex items-center gap-1.5'>
                                            <ReturnToolTip
                                                trigger={<MemoryStick className='text-foreground' size={20} />}
                                                content='Dedicated Fast Memory Speed'
                                            />
                                            <Label className='text-muted-foreground'>Ram: {server.memory}MB</Label>
                                        </div>
                                        <div className='flex items-center gap-1.5 w-24'>
                                            <ReturnToolTip
                                                trigger={<Cpu size={20} className='text-foreground' />}
                                                content="Cpu Power Available"
                                            />
                                            <Label>{server.cpu}%</Label>
                                        </div>
                                    </div>
                                    <div className='flex w-full justify-between'>
                                        <div className='flex items-center gap-1.5'>
                                            <ReturnToolTip
                                                trigger={<HardDrive className='text-foreground' size={20} />}
                                                content='NVMe Storage (2 GB/s Write, 7 GB/s Read)'
                                            />
                                            <Label className='text-muted-foreground'>Disk: {server.disk}MB</Label>
                                        </div>
                                        <div className='flex items-center gap-1.5 w-24'>
                                            <ReturnToolTip
                                                trigger={<Image src={'/logo.svg'} alt='Sonic Coin' width={20} height={20} />}
                                                content='Server Renewal Cost'
                                            />
                                            <Label className='text-muted-foreground font-[1000]'>{sonicInfo.renewal || 0}/<span className='text-xs font-normal'>30D</span></Label>
                                        </div>
                                    </div>
                                    <div className='flex w-full items-center justify-between'>
                                        <small className='text-muted-foreground'>Next Billing: {new Date(sonicInfo.next_billing || '').toLocaleDateString()}</small>
                                        <Button variant={server.status === 'suspended' ? 'destructive' : server.status === 'installing' ? "default" : "secondary"} className='h-8 cursor-default w-24'>
                                            {server.status === "installing" ? "Installing" : server.status === "suspended" ? "Suspended" : "Active"}
                                        </Button>
                                    </div>
                                    {server.status === 'suspended' && <div className='space-y-3 text-primary pt-3 border-t'>
                                        <div className='text-sm'>
                                            This Server will be deleted in {sonicInfo.deletion_countdown || 0} {sonicInfo.deletion_countdown > 1 ? "days" : "day"} if not renewed.
                                        </div>
                                        <div className='flex w-full items-center gap-5'>
                                            <Link href={process.env.NEXT_PUBLIC_APP_URL as string} className='w-full'>
                                                <Button className='w-full' variant={'secondary'}>Backup</Button>
                                            </Link>
                                            <RenewServer serverID={server.id} />
                                        </div>
                                    </div>}
                                </CardContent>
                            </Card>
                        )
                    }
                    ) : <div className='flex flex-col text-center pt-10 items-center w-full gap-5'>
                        <h1 className='text-xl font-black'>{"Look's like you don't have a server"}</h1>
                    </div>
                }
            </div>
        </div>
    )
}

export default UserServers