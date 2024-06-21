import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { faqItems } from '@/constant/faq'

const FAQ = () => {
    return (
        <div className='w-full flex justify-center'>
            <div className='flex flex-col gap-10 pb-12 w-full lg:w-2/3'>
                <h1 className='text-3xl font-black'>Questions? Look here.</h1>
                <Accordion type="single" collapsible>
                    {faqItems.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index + 1}`}>
                            <AccordionTrigger>{item.question}</AccordionTrigger>
                            <AccordionContent>{item.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    )
}

export default FAQ