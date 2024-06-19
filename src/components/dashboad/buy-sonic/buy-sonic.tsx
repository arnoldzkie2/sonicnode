/* eslint-disable react/no-unescaped-entities */
'use client'
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import EnterAmount from './enter-amount'
import ScanQr from './scan-qr'
import ConfirmOrder from './confirm-order'
import axios from 'axios'
import Instructions from './instructions'

const BuySonic = () => {

    const [open, setOpen] = useState(false)
    const [orderFormData, setOrderFormData] = useState({
        amount: '',
        method: '',
        status: 1,
        price: '',
        currency: 'USD',
        receipt: '',
    })
    const [acceptInstruction, setAcceptInstruction] = useState(false)

    const handleFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setOrderFormData(prev => ({ ...prev, [name]: value }))
    }

    const clearForm = () => {
        setOrderFormData({ amount: '', method: '', price: '', status: 1, receipt: '', currency: 'USD' })
        if (orderFormData.receipt) {
            axios.delete('/api/uploadthing', {
                data: {
                    url: orderFormData.receipt
                }
            })
        }
    }

    const closeOrder = () => {
        clearForm()
        setOpen(false)
    }

    const formBack = () => {
        setOrderFormData(prev => ({ ...prev, status: prev.status - 1 }))
    }

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
                                closeOrder={closeOrder}
                                setOrderFormData={setOrderFormData}
                            />
                        }
                        {orderFormData.status === 2 &&
                            <ScanQr
                                orderFormData={orderFormData}
                                formBack={formBack}
                                setOrderFormData={setOrderFormData}
                            />
                        }
                        {orderFormData.status === 3 &&
                            <ConfirmOrder
                                orderFormData={orderFormData}
                                formBack={formBack}
                                setOpen={setOpen}
                                clearForm={clearForm}
                            />
                        }
                    </>
                    : <Instructions acceptInstruction={acceptInstruction} setAcceptInstruction={setAcceptInstruction} />}
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default BuySonic