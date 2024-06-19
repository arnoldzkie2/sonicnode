import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import React from 'react'

const OrderNote = ({ note }: { note: string }) => {

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className='h-7' variant={'secondary'}>Show</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='w-full max-w-96 space-y-4'>
                <p className='text-lg'>{note}</p>
                <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default OrderNote