'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkCircle01Icon } from '@hugeicons/core-free-icons'
import { Flame } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
// Premium template purchase - can be removed if not needed
import { PremiumButton } from './pricing/premium-button'

export default function Pricing() {
  const communityFeatures = [
    { text: 'Full Next.js boilerplate', included: true },
    { text: 'Auth, payments & UI prewired', included: true },
    { text: 'Built-in SEO', included: true },
    { text: 'Resend transaction emails', included: true },
    { text: 'Payments via Stripe / Lemon Squeezy / Polar / Creem', included: true },
    { text: 'Up to 100+ hours saved', included: true },
    { text: 'MIT open-source license', included: true },
    { text: 'Community Releases & fixes', included: true },
  ]

  const premiumFeatures = [
    { text: 'Everything in free', included: true },
    { text: 'Internationalization', included: true },
    { text: 'Role-based access & invite system', included: true },
    { text: 'Advanced SEO & Blog', included: true },
    { text: 'Playwright and CI workflow', included: true },
    { text: 'Analytics hooks ready for Posthog', included: true },
    { text: 'Pro UI kit', included: true },
    { text: 'Private Discord Community', included: true },
    { text: 'Priority support', included: true },
  ]

  return (
    <section id='pricing' className='py-24 bg-[#F4F4F5]'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6'>
        <div className='mx-auto max-w-4xl'>
          <h2
            className='text-center text-sm font-medium text-muted-foreground mb-8'
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            Pricing
          </h2>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-semibold tracking-tight mb-4'>
              Built for builders who play to win
            </h2>
            <p className='text-lg text-muted-foreground'>
              Launch faster, sell sooner, and grow without fighting setup pain
            </p>
          </div>

          <div className='grid md:grid-cols-2 border border-[#E4E4E7] rounded-none overflow-hidden bg-transparent'>
            {/* Community */}
            <div className='flex flex-col p-8 border-r border-[#E4E4E7]'>
              <div className='mb-6'>
                <h3 className='text-2xl font-semibold mb-4'>Community</h3>
                <div className='mb-4'>
                  <span className='text-4xl font-semibold font-mono'>$0</span>
                </div>
                <p className='text-sm text-muted-foreground mb-4'>
                  For learners, early builders & indie devs who love to experiment.
                </p>
                <p
                  className='text-xs font-medium text-foreground uppercase'
                  style={{ fontFamily: 'var(--font-geist-mono)' }}
                >
                  INCLUDING
                </p>
              </div>
              <ul className='space-y-3 mb-8 flex-1'>
                {communityFeatures.map((feature, index) => (
                  <li key={index} className='flex items-center gap-2 text-sm'>
                    <HugeiconsIcon
                      icon={CheckmarkCircle01Icon}
                      className='h-4 w-4 text-muted-foreground shrink-0'
                    />
                    <span className='text-muted-foreground'>{feature.text}</span>
                  </li>
                ))}
              </ul>
              <div className='flex flex-col gap-2'>
                <Button variant='outline' className='w-full h-12! text-sm font-medium' size='lg'>
                  <svg
                    viewBox='0 0 16 16'
                    className='h-4 w-4'
                    fill='currentColor'
                    aria-hidden='true'
                  >
                    <path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z' />
                  </svg>
                  Clone repo
                </Button>
                <p className='text-sm text-center text-muted-foreground'>
                  Open source. Free forever
                </p>
              </div>
            </div>

            {/* Premium */}
            <div className='flex flex-col p-8 relative'>
              <div className='mb-6'>
                <div className='flex items-start justify-between mb-4'>
                  <h3 className='text-2xl font-semibold'>Premium</h3>
                  <Badge className='bg-white border border-[#DBDAD6] text-[#878787] rounded-full px-3 py-3 font-medium flex items-center gap-1.5'>
                    <Flame className='h-3.5 w-3.5' />
                    Most popular
                  </Badge>
                </div>
                <div className='mb-4'>
                  <div className='flex items-baseline gap-2'>
                    <span className='text-sm text-muted-foreground line-through font-mono'>
                      $150
                    </span>
                    <span className='text-4xl font-semibold font-mono'>$90</span>
                  </div>
                </div>
                <p className='text-sm text-muted-foreground mb-4'>
                  For founders & builders ready to ship real products and make money.
                </p>
                <p
                  className='text-xs font-medium text-foreground uppercase'
                  style={{ fontFamily: 'var(--font-geist-mono)' }}
                >
                  INCLUDING
                </p>
              </div>
              <ul className='space-y-3 mb-8 flex-1'>
                {premiumFeatures.map((feature, index) => (
                  <li key={index} className='flex items-center gap-2 text-sm'>
                    <HugeiconsIcon
                      icon={CheckmarkCircle01Icon}
                      className='h-4 w-4 text-muted-foreground shrink-0'
                    />
                    <span className='text-muted-foreground'>{feature.text}</span>
                  </li>
                ))}
              </ul>
              <div className='flex flex-col gap-2'>
                {/* Premium template purchase - can be removed if not needed */}
                <PremiumButton />
                <p className='text-sm text-center text-muted-foreground'>
                  Pay once. Build unlimited projects!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
