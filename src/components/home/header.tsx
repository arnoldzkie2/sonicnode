'use client'
import Link from 'next/link'
import React from 'react'
import { ModeToggle } from '../ui/toggle-theme'
import { DollarSign, FileQuestion, LogIn, Menu, PhoneIncoming } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'

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
              <Link href={'#'}>Pricing</Link>
              <DropdownMenuShortcut>
                <DollarSign size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={'#'}>About</Link>
              <DropdownMenuShortcut>
                <FileQuestion size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={'#'}>Contact</Link>
              <DropdownMenuShortcut>
                <PhoneIncoming size={16} />
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
        <Link className='hover:text-foreground' href={'#'}>Pricing</Link>
        <Link className='hover:text-foreground' href={'#'}>About</Link>
        <Link className='hover:text-foreground' href={'#'}>Contact</Link>
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
    <div className='px-5 sm:px-10 sticky top-0 w-screen h-14 border-b md:container flex items-center justify-between backdrop-blur'>
      <Link href={'/'} className='text-xl font-[1000]'>PIXELNODE</Link>
      {largeScreen}
      {smallScreen}
    </div>
  )
}

export default Header