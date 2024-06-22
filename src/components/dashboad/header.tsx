import Link from 'next/link'
import React from 'react'
import { ModeToggle } from '../ui/toggle-theme'
import Image from 'next/image'
import LogoutButton from './logout'

const DashboardHeader = () => {

  const smallScreen = (
    <nav className='flex items-center gap-5 md:hidden'>
      <ModeToggle />
      <LogoutButton />
    </nav>
  )

  const largeScreen = (
    <nav className='items-center gap-5 hidden md:flex'>
      <ModeToggle />
      <LogoutButton />
    </nav>
  )

  return (
    <div className='flex top-0 left-0 w-full px-5 padding fixed md:sticky md:p-0 md:w-full h-16 backdrop-blur padding items-center z-50 justify-between border-b'>
      <Link href={'/'} className='text-xl font-[1000] flex items-center gap-2'>
        <Image src={'/logo.svg'} width={28} height={28} alt='Logo' className='rounded-full text-secondary' />
        SonicNode
      </Link>
      {largeScreen}
      {smallScreen}
    </div>
  )
}

export default DashboardHeader