import React from 'react'
import { Label } from '../ui/label'
import { Cpu, GlobeLock, LogIn, MemoryStick, ShieldCheck } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { SOCIAL } from '@/constant/links'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Pterodatyl = () => {
  return (
    <div className='flex flex-col gap-16 py-20 items-center md:container'>
      <div className='flex items-start flex-col lg:flex-row gap-10 w-full'>
        <div className='flex flex-col gap-5 w-full lg:w-1/2 xl:w-3/4'>
          <Label className='text-xl text-primary'>Full Server Controll</Label>
          <h1 className='text-3xl font-black'>Jexactyl Panel Powered by Pterodactyl</h1>
          <p className='text-muted-foreground'>
            Enjoy full control over your server with an intuitive interface, allowing you to customize settings, manage players, and install plugins with ease. Experience reliable performance and security, perfect for serious gamers and server administrators.
          </p>
          <div className='flex items-center gap-5'>
            <Link href={'https://panel.sonicnode.xyz'}>
              <Button className='w-44'>
                Login Panel
                <LogIn className='ml-3' />
              </Button>
            </Link>
            <div className='flex items-center gap-3 mt-auto'>
              {SOCIAL.map((link, i) => (
                <Link key={i} href={link.link} className='text-foreground' target='_blank'>
                  <Button variant={'ghost'}>
                    <FontAwesomeIcon icon={link.icon} width={20} height={20} className='text-lg' />
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className='w-full'>
          <video width="640" height="360" className='h-full w-full rounded-2xl shadow shadow-yellow-300' autoPlay loop muted>
            <source src="/panel.mp4" type="video/mp4" className='w-full h-full' />
          </video>
        </div>
      </div>
      <div className='flex w-full justify-between flex-wrap border-t p-5 gap-8'>
        <div className='flex flex-col w-full sm:w-64 gap-2.5'>
          <Cpu className='pl-2' size={45} />
          <Label className='border-l border-primary pl-2 text-base'>Dedicated Server Resources</Label>
          <p className='text-muted-foreground pl-2 text-sm'>
            Unlike other hosts that often make false claims, we ensure exclusive access to CPU, RAM, and storage. This guarantee delivers smooth gameplay with no lag.
          </p>
        </div>
        <div className='flex flex-col w-full sm:w-64 gap-2.5'>
          <GlobeLock className='pl-2' size={45} />
          <Label className='border-l border-primary pl-2 text-base'>Designed for Asia-Pacific</Label>
          <p className='text-muted-foreground pl-2 text-sm'>
            Our servers are located in Singapore, Japan, and India ensure top performance across the Asia-Pacific. Enjoy unmatched speed, reliability, and security.
          </p>
        </div>
        <div className='flex flex-col w-full sm:w-64 gap-2.5'>
          <MemoryStick className='pl-2' size={45} />
          <Label className='border-l border-primary pl-2 text-base'>Unlimited Swap Disk</Label>
          <p className='text-muted-foreground pl-2 text-sm'>
            Swap disk enhances server performance by efficiently managing memory usage, preventing crashes caused by running out of memory during peak loads.
          </p>
        </div>
        <div className='flex flex-col w-full sm:w-64 gap-2.5'>
          <ShieldCheck className='pl-2' size={45} />
          <Label className='border-l border-primary pl-2 text-base'>Premium Hosting Features</Label>
          <p className='text-muted-foreground pl-2 text-sm'>
            Experience a blazing-fast NVMe storage with speeds up to 2 GB/s write and 7 GB/s read. Includes 5 dedicated ports, a free MySQL database, and 24/7 uptime with 99% reliability.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Pterodatyl