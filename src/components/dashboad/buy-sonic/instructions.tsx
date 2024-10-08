/* eslint-disable react/no-unescaped-entities */
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import React from 'react'

const Instructions = ({ acceptInstruction, setAcceptInstruction }: {
    acceptInstruction: boolean
    setAcceptInstruction: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    return (
        <>
            <div className='flex flex-col gap-2 border-b pb-2'>
                <h1 className='text-2xl'>Sonic Purchase Instructions</h1>
                <small className='text-muted-foreground text-sm'>
                    Follow these steps to complete your purchase
                </small>
            </div>
            <div>
                <ol className='list-decimal list-inside ml-4 space-y-2 pt-2'>
                    <li>
                        <span className='mr-1.5 text-sm'>Enter Amount:</span>
                        <small className='text-muted-foreground'>
                            Enter how much sonic coin you will buy, ₱1 = 1 Sonic Coin.
                        </small>
                    </li>
                    <li>
                        <span className='mr-1.5 text-sm'>Proceed to Checkout:</span>
                        <small className='text-muted-foreground'>
                            After entering the amount, click 'Buy' to be redirected to the checkout page where you can complete your payment.
                        </small>
                    </li>
                    <li>
                        <span className='mr-1.5 text-sm'>Payment Verification:</span>
                        <small className='text-muted-foreground'>
                            Your payment will be verified automatically. Your Sonic Coins will be credited in a minute once the payment is successfully processed.
                        </small>
                    </li>
                </ol>
                {/* <div className='flex flex-col mt-5'>
                    <Label className='text-lg'>Forgot to Take a Screenshot?</Label>
                    <small className='text-muted-foreground'>
                        If you forget to take a screenshot of your receipt, you can contact us at <span className='underline text-foreground'>support@sonicnode.xyz</span> to verify the order. Please provide the following information:</small>
                </div>
                <ul className='list-disc list-inside ml-4 space-y-1'>
                    <li>
                        <span className='mr-1.5 text-sm'>Payment Method Used:</span>
                        <small className='text-muted-foreground'>
                            Specify the method you used to make the payment (e.g., GCash, PayPal, Crypto).
                        </small>
                    </li>
                    <li>
                        <span className='mr-1.5 text-sm'>Transaction ID:</span>
                        <small className='text-muted-foreground'>
                            Provide the unique transaction ID associated with your payment.
                        </small>
                    </li>
                    <li>
                        <span className='mr-1.5 text-sm'>Amount:</span>
                        <small className='text-muted-foreground'>
                            State the exact amount you paid.
                        </small>
                    </li>
                    <li>
                        <span className='mr-1.5 text-sm'>Currency:</span>
                        <small className='text-muted-foreground'>
                            Indicate the currency in which the payment was made.
                        </small>
                    </li>
                </ul>
                <div className='mt-5 flex flex-col'>
                    <Label className='text-lg'>Important Notes</Label>
                    <small className='text-muted-foreground'>Please ensure that all the information provided is accurate to avoid delays in the verification process. Once your payment is verified, your Sonic Coins will be credited to your account, and you can proceed to purchase a server.</small>
                </div> */}
                <div className='flex items-center pt-3 border-t mt-3 gap-2'>
                    <Checkbox checked={acceptInstruction} onCheckedChange={() => setAcceptInstruction(prev => !prev)} className='h-5 w-5' />
                    <Label>
                        I've carefully reviewed the instructions
                    </Label>
                </div>
            </div>
        </>
    )
}

export default Instructions