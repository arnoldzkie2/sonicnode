'use client'
import { caller } from '@/app/_trpc/server'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import Link from 'next/link'
import { Button } from '../ui/button'
import { Bolt, Cpu, ExternalLink, Gift, HardDrive, LoaderCircle, MemoryStick } from 'lucide-react'
import ReturnToolTip from '../ui/return-tooltip'
import Image from 'next/image'
import { SonicInfo } from '@/server/routes/serverRoute'
import { trpc } from '@/app/_trpc/client'
import UserCredits from './user-credits'
import { Separator } from '../ui/separator'
import ClaimServer from './claim-freetrial-server'
import ServerSettings from './server-settings'

interface Props {
    initialData: Awaited<ReturnType<(typeof caller['dashboard']['getDashboardData'])>>
}

const UserData = ({ initialData }: Props) => {

    const { data: userData, refetch: refetchUserData } = trpc.dashboard.getDashboardData.useQuery(undefined, {
        refetchOnMount: false,
        initialData: initialData,
    })

    const refetchServer = trpc.dashboard.getDashboardData.useQuery(undefined, {
        refetchOnMount: false,
        refetchInterval: userData.servers.some(server => server.status === 'installing') ? 10000 : 0
    })

    const returnStatusButton = (status: string | null) => {

        switch (status) {
            case "installing":
                return (
                    <Button className='h-8 w-20 p-0'>
                        <LoaderCircle size={16} className='animate-spin' />
                    </Button>
                )
            case "suspended":
                return (
                    <Button className='h-8 w-20' variant={'destructive'}>
                        Suspended
                    </Button>
                )
            default:
                return (
                    <Button className='h-8 w-24 bg-green-500 hover:bg-green-500 text-secondary'>Active</Button>
                )
        }
    }

    return (
        <div className='flex flex-col w-full max-w-[500px]'>
            {!userData.trial_claimed &&
                <div className='py-5 w-full space-y-2 border-b'>
                    <Label className='text-primary text-lg'>Free Trial (3Days)</Label>
                    <p className='text-muted-foreground text-sm'>Try our coal plan free for 3 days. No payment needed.</p>
                    <ClaimServer
                        eggs={initialData.eggs}
                        trigger={
                            <Button className='w-full'>CLAIM FREE TRIAL<Gift size={16} className='animate-bounce ml-2' /></Button>
                        } />
                </div>}
            <UserCredits initialData={userData} />
            <Separator />
            <div className='flex items-center py-5 gap-5 w-full justify-between'>
                <Link href={process.env.NEXT_PUBLIC_APP_URL as string} target='_blank'>
                    <Button className='flex items-center gap-2 text-foreground' variant={'secondary'}>
                        <div>Control Panel</div>
                        <ExternalLink size={16} />
                    </Button>
                </Link>
            </div>
            <div className='flex flex-wrap w-full gap-4'>
                {
                    userData.servers.length > 0 ? userData.servers.map((server, i) => {
                        const sonicInfo: SonicInfo = JSON.parse(server.sonic_info || "{}")
                        return (
                            <Card key={i} className='w-full'>
                                <CardHeader>
                                    <CardTitle className='flex w-full items-center justify-between'>
                                        <div>
                                            {server.name}
                                        </div>
                                        <ServerSettings serverID={server.id} refetch={refetchUserData} />
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className='flex flex-col gap-2 text-muted-foreground'>
                                    <div className='flex w-full justify-between'>
                                        <div className='flex items-center gap-1.5'>
                                            <ReturnToolTip
                                                trigger={<MemoryStick className='text-foreground' size={20} />}
                                                content='Dedicated Fast Memory Speed'
                                            />
                                            <Label className='text-muted-foreground'>Ram: {server.memory}MiB</Label>
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
                                            <Label className='text-muted-foreground'>Disk: {server.disk}MiB</Label>
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
                                        {returnStatusButton(server.status)}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    }
                    ) : <div className='flex flex-col text-center pt-10 items-center w-full gap-5'>
                        <h1 className='text-lg'>{"Look's like you don't have a server"}</h1>
                    </div>
                }
            </div>
        </div>
    )
}

export default UserData