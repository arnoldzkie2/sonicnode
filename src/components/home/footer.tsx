import React from 'react'
import Link from 'next/link';
import { Label } from '../ui/label';
const Footer = () => {
    return (
        <footer className='md:px-0 gap-5 flex flex-col items-center text-muted-foreground py-10'>
            <div className='pt-10 w-full border-t flex flex-col gap-5 md:flex-row md:justify-between'>
                <div className='flex gap-4 items-center order-2 md:order-1 text-sm'>
                    © 2024, SonicNode
                    <Link href={'/'}>Terms</Link>
                    <Link href={'/'}>Privacy</Link>
                </div>
                <ul className='flex gap-4 items-center order-1 md:order-2'>
                    <Label >Join Us</Label>
                </ul>
                <ul className='flex flex-col md:flex-row md:items-center gap-4 order-3'>
                    <li className='flex items-center gap-3'>
                        <p className='text-sm'>support@sonicnode.xyz</p>
                    </li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer