'use client'
import Link from 'next/link'
import React from 'react'
import { ModeToggle } from '../ui/toggle-theme'
import { DollarSign, FileQuestion, LogIn, LogInIcon, Menu, NotepadText, PhoneIncoming } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import Image from 'next/image'
const Header = () => {

  const smallScreen = (
    <nav className='flex items-center gap-5 md:hidden'>
      <ModeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <Menu className='cursor-pointer' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Menu List</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className='text-muted-foreground'>
            <DropdownMenuItem>
              <Link href={'#'}>Billing</Link>
              <DropdownMenuShortcut>
                <NotepadText size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={'#'}>Panel</Link>
              <DropdownMenuShortcut>
                <LogInIcon size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )

  const largeScreen = (
    <nav className='items-center gap-5 hidden md:flex'>
      <ul className='flex items-center gap-8 text-muted-foreground text-sm'>
        <Link className='hover:text-foreground flex items-center gap-2' href={'#'}>
          Billing
          <NotepadText size={16} className='' />
        </Link>
      </ul>
      <ModeToggle />
      <Link href={'/auth'}>
        <Button className='flex items-center gap-2'>
          <div>
            Login
          </div>
          <LogIn size={16} />
        </Button>
      </Link>
    </nav>
  )

  return (
    <div className='flex top-0 left-0 w-full px-5 padding fixed md:sticky md:p-0 md:w-full h-16 backdrop-blur padding items-center z-50 justify-between border-b'>
      <Link href={'/'} className='text-xl font-[1000] flex items-center gap-2'>
        <Image src={'/logo.svg'} width={25} height={25} alt='Logo' className='bg-white rounded-full text-secondary' />
        Sonic Node
      </Link>
      {largeScreen}
      {smallScreen}
    </div>
  )
}

export default Header