'use client'

import { Button } from '@/components/ui/button'
import { BiSolidZap } from 'react-icons/bi'
import { ArrowUpRight } from 'lucide-react'
import {
  Tooltip,
  TooltipCreateHandle,
  TooltipProvider,
  TooltipTrigger,
  TooltipPopup,
} from '@/components/ui/tooltip'

const tooltipHandle = TooltipCreateHandle<React.ComponentType>()

// Tooltip content components
const BetterAuthContent = () => <span>Better Auth</span>
const TailwindCSSContent = () => <span>Tailwind CSS</span>
const TypeScriptContent = () => <span>TypeScript</span>
const TanStackContent = () => <span>TanStack</span>
const VercelContent = () => <span>Vercel AI SDK</span>
const BunContent = () => <span>Bun</span>
const BaseUIContent = () => <span>Base UI</span>

export default function Hero() {
  return (
    <main
      id='hero'
      className='flex min-h-screen flex-col bg-[#F4F4F5] items-center justify-start pt-40 pb-24'
    >
      <div className='mx-auto w-full max-w-6xl px-4 sm:px-6'>
        <div className='mx-auto max-w-4xl text-center'>
          <h1 className='mx-auto max-w-3xl text-balance text-center font-semibold text-4xl leading-tight tracking-tighter sm:text-5xl md:max-w-4xl md:text-6xl lg:leading-[1.1]'>
            A production-ready{' '}
            <img
              src='/nextjs_logo.svg'
              alt='Next.js'
              className='inline-block h-[0.9em] w-[0.9em] align-middle mx-1'
            />{' '}
            Next.js boilerplate built to make $$$
          </h1>
          <p className='mx-auto mt-6 max-w-xl text-balance text-center text-muted-foreground md:max-w-2xl md:text-lg'>
            Go from idea to income in record time. A modern boilerplate that saves you weeks of
            setup so you can spend time building features that actually make money.{' '}
          </p>
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

        {/* Built With Section */}
        <TooltipProvider>
          <div className='mt-24 w-full'>
            <h2
              className='text-center text-sm font-medium text-muted-foreground mb-8'
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              BUILT WITH THE BEST TOOLS
            </h2>
            <div className='flex items-center justify-center gap-1 sm:gap-5 md:gap-6 flex-wrap'>
              {/* Vercel AI SDK */}
              <TooltipTrigger
                handle={tooltipHandle}
                payload={VercelContent}
                className='flex items-center justify-center h-12 w-12 cursor-pointer'
              >
                <img
                  src='/stack-icons/vercel.svg'
                  alt='Vercel AI SDK'
                  className='h-12 w-12 opacity-70 transition-opacity duration-200 hover:opacity-100 brightness-0'
                />
              </TooltipTrigger>

              {/* Tailwind CSS */}
              <TooltipTrigger
                handle={tooltipHandle}
                payload={TailwindCSSContent}
                className='flex items-center justify-center h-12 w-12 cursor-pointer'
              >
                <img
                  src='/stack-icons/tailwindcss.svg'
                  alt='Tailwind CSS'
                  className='h-12 w-12 opacity-70 transition-opacity duration-200 hover:opacity-100'
                />
              </TooltipTrigger>

              {/* TypeScript */}
              <TooltipTrigger
                handle={tooltipHandle}
                payload={TypeScriptContent}
                className='flex items-center justify-center h-12 w-12 cursor-pointer'
              >
                <img
                  src='/stack-icons/typescript.svg'
                  alt='TypeScript'
                  className='h-12 w-12 opacity-70 transition-opacity duration-200 hover:opacity-100'
                />
              </TooltipTrigger>

              {/* Better Auth */}
              <TooltipTrigger
                handle={tooltipHandle}
                payload={BetterAuthContent}
                className='flex items-center justify-center h-12 w-12 cursor-pointer'
              >
                <img
                  src='/stack-icons/better-auth.svg'
                  alt='Better Auth'
                  className='h-12 w-12 opacity-70 transition-opacity duration-200 hover:opacity-100'
                />
              </TooltipTrigger>

              {/* TanStack */}
              <TooltipTrigger
                handle={tooltipHandle}
                payload={TanStackContent}
                className='flex items-center justify-center h-12 w-12 cursor-pointer'
              >
                <img
                  src='/stack-icons/tanstack.svg'
                  alt='TanStack'
                  className='h-12 w-12 opacity-70 transition-opacity duration-200 hover:opacity-100'
                />
              </TooltipTrigger>

              {/* Base UI */}
              <TooltipTrigger
                handle={tooltipHandle}
                payload={BaseUIContent}
                className='flex items-center justify-center h-12 w-12 cursor-pointer'
              >
                <img
                  src='/stack-icons/base-ui.svg'
                  alt='Base UI'
                  className='h-12 w-12 opacity-70 transition-opacity duration-200 hover:opacity-100'
                />
              </TooltipTrigger>

              {/* Bun */}
              <TooltipTrigger
                handle={tooltipHandle}
                payload={BunContent}
                className='flex items-center justify-center h-12 w-12 cursor-pointer'
              >
                <img
                  src='/stack-icons/bun.svg'
                  alt='Bun'
                  className='h-12 w-12 opacity-70 transition-opacity duration-200 hover:opacity-100'
                />
              </TooltipTrigger>
            </div>
          </div>

          <Tooltip handle={tooltipHandle}>
            {({ payload: Payload }) => (
              <TooltipPopup>{Payload !== undefined && <Payload />}</TooltipPopup>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </main>
  )
}
