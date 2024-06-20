'use client'
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
import OrderNote from './order/note'
import { trpc } from '@/app/_trpc/client'
import { caller } from '@/app/_trpc/server'

interface OrderTableProps {
    initialData: Awaited<ReturnType<(typeof caller['dashboard']['getDashboardData'])>>
}

const OrderTable = ({ initialData }: OrderTableProps) => {

    const orders = trpc.order.getUserOrders.useQuery(undefined, {
        initialData: initialData.orders,
        refetchOnMount: false
    })

    return (
        <div className="w-full max-w-[1000px]">
            <Table>
                <TableCaption>Order History</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Currency</TableHead>
                        <TableHead>Receipt</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>ID</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.data.length > 0 ? orders.data.map(order => (
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
                                    <AlertDialogContent className='flex flex-col gap-5 w-full max-w-96 max-h-[650px] overflow-y-auto'>
                                        <Image src={order.receipt} alt='Order Receipt' width={300} height={300} className='w-full h-auto' />
                                        <AlertDialogCancel>Close</AlertDialogCancel>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                            <TableCell>
                                <OrderNote note={order.note || ''} />
                            </TableCell>
                            <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                            <TableCell>{order.id}</TableCell>
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