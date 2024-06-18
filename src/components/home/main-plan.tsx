'use client'
import React from 'react'
import { Link } from 'react-scroll'
import { Button } from '../ui/button'

const MainPlan = () => {
    return (
        <Link href='#plans' to='plans' smooth={true} duration={2000}>
            <Button className='w-full md:w-44'>Explore Our Plans</Button>
        </Link>
    )
}

export default MainPlan