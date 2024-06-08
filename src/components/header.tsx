'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { ModeToggle } from './ui/toggle-theme'
import { CircleX, DollarSign, FileQuestion, Menu, PhoneIncoming } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'

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
          <DropdownMenuGroup>
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
      <ul className='flex items-center gap-5'>
        <Link href={'#'}>Pricing</Link>
        <Link href={'#'}>About</Link>
        <Link href={'#'}>Contact</Link>
      </ul>
      <ModeToggle />
    </nav>
  )

  return (
    <div className='px-5 sm:px-10 sticky top-0 w-screen h-16 border-b md:container flex items-center justify-between backdrop-blur'>
      <h1 className='text-xl md:text-2xl font-black'>PIXELNODE</h1>
      {largeScreen}
      {smallScreen}
    </div>
  )
}

export default Header