'use client'
import React from 'react'
import Autoplay from "embla-carousel-autoplay"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import Image from 'next/image'

const Screenshots = () => {

    const plugin = React.useRef(
        Autoplay({ delay: 2000 })
    )
    return (
        <Carousel
            plugins={[plugin.current]}
            className='w-full'
        >
            <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index}>
                        <Image alt='Screenshots' src={`/screenshot/ss${index + 1}.png`} width={1000} height={300} className='w-full h-auto rounded-lg' />
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    )
}



export default Screenshots