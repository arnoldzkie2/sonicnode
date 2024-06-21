/* eslint-disable react/no-unescaped-entities */
'use client'
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import EnterAmount from './enter-amount'
import Instructions from './instructions'

const BuySonic = () => {

    const [open, setOpen] = useState(false)
    const [orderFormData, setOrderFormData] = useState({
        amount: '',
        status: 1,

    })
    const [acceptInstruction, setAcceptInstruction] = useState(false)

    const handleFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setOrderFormData(prev => ({ ...prev, [name]: value }))
    }

    const clearForm = () => {
        setOrderFormData({ amount: '', status: 1 })
    }

    const closeOrder = () => {
        clearForm()
        setOpen(false)
        // if (orderFormData.receipt) {
        //     axios.delete('/api/uploadthing', {
        //         data: {
        //             url: orderFormData.receipt
        //         }
        //     })
        // }
    }

    // const formBack = () => {
    //     setOrderFormData(prev => ({ ...prev, status: prev.status - 1 }))
    // }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button className='h-8'>Buy Sonic</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='w-full max-w-96 max-h-[650px] overflow-y-auto'>
                {acceptInstruction ?
                    <>
                        {orderFormData.status === 1 &&
                            <EnterAmount handleFormData={handleFormData}
                                orderFormData={orderFormData}
                                setOpen={setOpen}
                                closeOrder={closeOrder}
                                setOrderFormData={setOrderFormData}
                            />
                        }
                    </>
                    : <Instructions acceptInstruction={acceptInstruction} setAcceptInstruction={setAcceptInstruction} />}
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default BuySonic