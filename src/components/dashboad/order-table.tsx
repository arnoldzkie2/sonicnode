import React from 'react'
import { users_orders } from '@prisma/client'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from '../ui/button'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogTrigger } from '../ui/alert-dialog'
import Image from 'next/image'

interface OrderTableProps {
    data: users_orders[]
}

const OrderTable = ({ data }: OrderTableProps) => {
    return (
        <div className="w-full max-w-[700px]">
            <Table>
                <TableCaption>Order History</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Currency</TableHead>
                        <TableHead>Receipt</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? data.map(order => (
                        <TableRow key={order.id} className='text-muted-foreground'>
                            <TableCell>{order.status}</TableCell>
                            <TableCell>{order.method}</TableCell>
                            <TableCell>{order.price}</TableCell>
                            <TableCell>{order.currency}</TableCell>
                            <TableCell>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button className='h-7'>View</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className='flex flex-col gap-5 w-full max-w-96'>
                                        <Image src={order.receipt} alt='Order Receipt' width={300} height={300} className='w-full h-auto' />
                                        <AlertDialogCancel>Close</AlertDialogCancel>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                    )) :
                        <TableRow>
                            <TableCell className='min-w-28'>No Orders</TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default OrderTable