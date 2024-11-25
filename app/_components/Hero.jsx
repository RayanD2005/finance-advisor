import React from 'react'
import Image from 'next/image'
import { ContainerScroll, MacbookScroll } from '@/components/ui/container-scroll-animation'

function Hero(){
    return (
        <section className='bg-neutral-900 flex items-center flex-col border-neutral-500'>
            <div className="flex flex-col overflow-hidden ">
                <MacbookScroll
                    title={
                    <>
                        <h1 className="text-4xl font-semibold text-white dark:text-white">
                        Get your money up, not your funny up with <br />
                        <span className="text-4xl md:text-[6rem] text-primary font-bold mt-1 leading-none">
                            Aura
                        </span>
                        </h1>
                    </>
                    }
                >
                    <Image
                    src={`/chart-donut.svg`} //Change to screenshot of finalised dashboard
                    alt="hero"
                    height={720}
                    width={14000}
                    className="mx-auto rounded-2xl object-cover h-full object-left-top"
                    draggable={false}
                    />
                </MacbookScroll>
            </div>
        </section>
    )
}

export default Hero;