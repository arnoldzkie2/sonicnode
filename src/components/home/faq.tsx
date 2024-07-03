import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { faqItems, faqItems2 } from '@/constant/faq'

const FAQ = () => {
    return (
        <div className='w-full flex justify-center py-10'>
            <div className='flex flex-col gap-10 py-12 lg:py-0 lg:pb-12 w-full'>
                <h1 className='lg:hidden text-3xl font-[1000]'>Questions? Look here.</h1>
                <div className='flex flex-col md:flex-row w-full md:gap-10 lg:gap-20'>
                    <Accordion type='single' collapsible className='w-full'>
                        {faqItems.map((item, index) => (
                            <AccordionItem key={index} value={`item-${index + 1}`} className='px-1'>
                                <AccordionTrigger className='text-start'>{item.question}</AccordionTrigger>
                                <AccordionContent className='text-muted-foreground'>{item.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                    <Accordion type='single' collapsible className='w-full'>
                        {faqItems2.map((item, index) => (
                            <AccordionItem key={index} value={`item-${index + 1}`} className='px-1'>
                                <AccordionTrigger className='text-start'>{item.question}</AccordionTrigger>
                                <AccordionContent className='text-muted-foreground'>{item.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </div>
    )
}

export default FAQ