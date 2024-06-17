'use client'
import Link from 'next/link'
import React from 'react'
import { ModeToggle } from '../ui/toggle-theme'
import { LogIn, LogInIcon, Menu, NotepadText } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import Image from 'next/image'
import { Link as ScrollLink } from 'react-scroll'
import { useSession } from 'next-auth/react'

const Header = () => {

  const session = useSession()

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
            <ScrollLink to='plans' smooth={true} duration={2000}>
              <DropdownMenuItem>
                Plans
                <DropdownMenuShortcut>
                  <NotepadText size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </ScrollLink>
            {session.status === 'authenticated' ?
              <Link href={'/dashboard'}>
                <DropdownMenuItem>
                  Dashboard
                </DropdownMenuItem>
              </Link> :
              <Link href={'/auth'}>
                <DropdownMenuItem>
                  Sign In
                  <DropdownMenuShortcut>
                    <LogInIcon size={16} />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </Link>
            }
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )

  const largeScreen = (
    <nav className='items-center gap-5 hidden md:flex'>
      <ul className='flex items-center gap-8 text-muted-foreground text-sm'>
        <ScrollLink to='plans' smooth={true} duration={2000} className='hover:text-foreground cursor-pointer flex items-center gap-2'>
          Plans
          <NotepadText size={16} className='' />
        </ScrollLink>
      </ul>
      <ModeToggle />
      {
        session.status === 'authenticated' ?
          <Link href={'/dashboard'}>
            <Button className='flex items-center gap-2'>
              <div>
                Dashboard
              </div>
            </Button>
          </Link> :
          <Link href={'/auth'}>
            <Button className='flex items-center gap-2'>
              <div>
                Sign in
              </div>
              <LogIn size={16} />
            </Button>
          </Link>
      }
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

export default Header