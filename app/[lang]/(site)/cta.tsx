'use client'

import { ArrowUpRight } from 'lucide-react'
import { BiSolidZap } from 'react-icons/bi'
import { Button } from '@/components/ui/button'

export default function CTA() {
  return (
    <section className='py-24 px-4 sm:px-6 bg-[#F4F4F5]'>
      <div className='mx-auto max-w-4xl'>
        {/* Section label */}
        <h2
          className='text-center text-sm font-medium text-muted-foreground mb-8'
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          GET STARTED
        </h2>

        {/* Main heading */}
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-semibold tracking-tight mb-4'>
            Your next product could be live by tonight.
          </h2>
          <p className='text-lg text-muted-foreground'>
            Focus on growth while the stack takes care of the heavy lifting
          </p>
        </div>

        {/* Buttons */}
        <div className='mx-auto mt-10 flex items-center justify-center gap-4'>
          <Button variant='default' className='text-white font-semibold h-12! px-8 text-base'>
            <BiSolidZap className='h-8 w-8' />
            Get ShipFree
          </Button>
          <Button variant='outline' className='font-semibold h-12! px-8 text-base'>
            Try demo
            <ArrowUpRight className='h-8 w-8' />
          </Button>
        </div>
      </div>
    </section>
  )
}
