'use client'
import React from 'react'
import { Link } from 'react-scroll'
import { Button } from '../ui/button'
import { Settings2 } from 'lucide-react'

const MainPlan = () => {
    return (
        <Link href='#plans' to='plans' smooth={true} duration={2000} className='w-full'>
            <Button className='w-full md:w-44'>Plans
                <Settings2 size={18} className='ml-2' />
            </Button>
        </Link>
    )
}

export default MainPlan