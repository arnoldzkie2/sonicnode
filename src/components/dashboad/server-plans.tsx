'use client'
import { PLANS } from '@/constant/plans'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import ReturnToolTip from '../ui/return-tooltip'
import Image from 'next/image'
import { Cpu, HardDrive, MapPin, Users } from 'lucide-react'
import { Label } from '../ui/label'
import CreateServer from './create-server'

const ServerPlans = ({ eggs }: {
  eggs: {
    name: string,
    id: number
  }[] | undefined
}) => {

  const [serverFormData, setServerFormData] = useState({
    plan: '',
    name: '',
    egg: ''
  })

  return (
    <div className='flex flex-col pt-5 items-center pb-10' id='plans'>
      <div className='flex flex-wrap lg:w-2/3 gap-5 md:gap-10 justify-center'>
        {PLANS.map((plan, i) => (
          <Card key={i} className='w-full max-w-80 cursor-pointer hover:shadow-2xl hover:rounded-2xl hover:shadow-yellow-400 hover:scale-[101%] transition-all'>
            <CardHeader>
              <CardTitle className='flex items-center justify-between w-full'>
                <div className='flex flex-col gap-1'>
                  <div className='text-muted-foreground text-base'>{plan.name.toUpperCase()}</div>
                  <ReturnToolTip
                    trigger={<h1 className='font-[1000] text-primary'>{plan.ram}MB</h1>}
                    content='Dedicated High Speed RAM'
                  />
                </div>
                <Image src={`/ores/${plan.name.toLowerCase()}.png`} alt='Ores' width={60} height={60} />
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-2 text-muted-foreground'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <ReturnToolTip
                    trigger={<HardDrive className='text-foreground' size={20} />}
                    content='NVMe Storage (2 GB/s Write, 7 GB/s Read)'
                  />
                  <Label className='text-muted-foreground'>NVMe Disk: {plan.disk}GB</Label>
                </div>
                <div className='flex items-center gap-2'>
                  <ReturnToolTip
                    trigger={<Users size={20} className='text-foreground' />}
                    content="Recommended player slots"
                  />
                  <Label className='w-6'>{plan.players}+</Label>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2 '>
                  <ReturnToolTip
                    trigger={<Cpu size={20} className='text-foreground' />}
                    content="Cpu Power Available"
                  />
                  <Label>Cpu: {plan.cpu} ({plan.cpu_speed}GHz)</Label>
                </div>
                <div className='flex items-center gap-2'>
                  <ReturnToolTip
                    trigger={<MapPin size={20} className='text-foreground' />}
                    content="Server Location"
                  />
                  <Label className='w-6'>{plan.location}</Label>
                </div>
              </div>
              <div className='flex items-end w-full justify-between pt-2 border-t'>
                <div className='flex flex-col gap-1'>
                  <Label className='text-muted-foreground'>Server cost {'->'}</Label>
                  <div className='text-foreground flex items-center font-[1000] border-b-2 border-yellow-400 text-2xl'>
                    <ReturnToolTip
                      trigger={
                        <Image src="/logo.svg" width={25} height={25} alt='Sonic Coin' className='mr-1.5' />
                      }
                      content='Sonic Coin $1 = 100 Sonic Coins'
                    />
                    {plan.price}/<span className='text-sm pt-1.5 text-muted-foreground'>30D</span>
                  </div>
                </div>
                <CreateServer
                  eggs={eggs}
                  plan={plan.name}
                  serverFormData={serverFormData}
                  setServerFormData={setServerFormData}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ServerPlans