import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogTrigger } from '../ui/alert-dialog'
import { caller } from '@/app/_trpc/server'
import { Button } from '../ui/button'
import Image from 'next/image'
import OrderOperation from './order-operation'

const OrderTable = ({ orders }: {
    orders: Awaited<ReturnType<(typeof caller['order']['getAllOrders'])>>
}) => {
    return (
        <div className="w-full">
            <Table>
                <TableCaption>Order History</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Currency</TableHead>
                        <TableHead>Receipt</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Operation</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.orders.length > 0 ? orders.orders.map(order => (
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
                            <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
                            <TableCell>
                                <OrderOperation order={order} />
                            </TableCell>
                        </TableRow>
                    )) :
                        <TableRow>
                            <TableCell className='min-w-28'>No Orders Yet</TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default OrderTable