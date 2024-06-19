'use client'
import { users_orders } from '@prisma/client'
import React, { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button'
import { CircleCheck, CircleX, Ellipsis } from 'lucide-react'
import VerifyOrder from './verify-order'
import { ORDERSTATUS } from '@/constant/status'
import InvalidOrder from './invalid-order'

const OrderOperation = ({ order }: {
    order: users_orders
}) => {

    const [operation, setOperation] = useState('')

    return (
        <>
            <VerifyOrder order={order} operation={operation} setOperation={setOperation} />
            <InvalidOrder order={order} operation={operation} setOperation={setOperation} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={'secondary'} className='h-6'>
                        <Ellipsis size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Select Operation</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {order.status !== ORDERSTATUS['completed'] && <DropdownMenuItem onClick={() => setOperation('verify')}>
                        Completed
                        <DropdownMenuShortcut>
                            <CircleCheck className='text-primary' size={18} />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>}
                    {order.status !== ORDERSTATUS['completed'] && <DropdownMenuItem onClick={() => setOperation('invalid')}>
                        Invalid
                        <DropdownMenuShortcut>
                            <CircleX className='text-destructive' size={18} />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Close</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </>
    )
}

export default OrderOperation