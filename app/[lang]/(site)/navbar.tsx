'use client'

import Link from 'next/link'
import { X, Menu } from 'lucide-react'
import { useEffect, useState } from 'react'

import { getGitHubStars } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from '@/lib/auth/auth-client'

export default function Navbar() {
  const { data: session, isPending } = useSession()
  const [stars, setStars] = useState<number | null>(null)
  const [isLoadingStars, setIsLoadingStars] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const repo = 'revokslab/shipfree'

  useEffect(() => {
    getGitHubStars(repo)
      .then((starsCount) => {
        setStars(starsCount)
      })
      .catch(() => {
        setStars(null)
      })
      .finally(() => {
        setIsLoadingStars(false)
      })
  }, [])

  const formatStars = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      <nav className='fixed inset-x-0 top-0 z-30 border-b border-[#E4E4E7] bg-[#F4F4F5]'>
        <div className='mx-auto max-w-7xl flex h-14 items-center justify-between gap-8 px-4 sm:px-6'>
          <div className='flex items-center gap-3'>
            <Link href='/' className='flex items-center gap-2'>
              <img src='/image.png' alt='ShipFree Logo' className='h-6 w-6 object-contain' />
              <span
                className='text-base font-semibold text-foreground'
                style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
              >
                ShipFree
              </span>
            </Link>
          </div>

          <div className='flex-1' />

          <div className='flex items-center gap-6'>
            <div className='hidden items-center gap-6 md:flex'>
              <Link
                href='#features'
                className='text-sm font-medium text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground'
              >
                Features
              </Link>
              <Link
                href='#pricing'
                className='text-sm font-medium text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground'
              >
                Pricing
              </Link>
              <Link
                href='#wall-of-love'
                className='text-sm font-medium text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground'
              >
                Wall of love
              </Link>
              <Link
                href='#faq'
                className='text-sm font-medium text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground'
              >
                FAQ
              </Link>
              <Link
                href='/docs'
                className='text-sm font-medium text-muted-foreground transition-colors duration-200 ease-in-out hover:text-foreground'
              >
                Docs
              </Link>
            </div>

            <div className='hidden h-6 w-px bg-black/30 md:block' />

            <a
              href={`https://github.com/${repo}`}
              target='_blank'
              rel='noopener noreferrer'
              className='hidden items-center gap-2 rounded-md md:flex'
              aria-label='GitHub'
            >
              <svg
                viewBox='0 0 16 16'
                className='h-5 w-5 text-[#38383A]'
                fill='currentColor'
                aria-hidden='true'
              >
                <path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z' />
              </svg>
              {isLoadingStars ? (
                <Skeleton className='h-4 w-8' />
              ) : (
                stars !== null && (
                  <span className='text-sm font-medium text-muted-foreground'>
                    {formatStars(stars)}
                  </span>
                )
              )}
            </a>

            {!isPending && (
              <>
                {session ? (
                  <Link href='/dashboard'>
                    <Button>Go to App</Button>
                  </Link>
                ) : (
                  <Link href='/upgrade'>
                    <Button variant='ghost'>Upgrade to Pro</Button>
                  </Link>
                )}
              </>
            )}

            <button
              type='button'
              onClick={toggleMenu}
              className='inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden'
            >
              <span className='sr-only'>Toggle menu</span>
              {isMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className='border-t border-border md:hidden'>
            <div className='mx-auto max-w-6xl space-y-1 px-4 sm:px-6 pb-3 pt-2'>
              <Link
                href='#features'
                className='block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 ease-in-out hover:bg-accent hover:text-accent-foreground'
                onClick={toggleMenu}
              >
                Features
              </Link>
              <Link
                href='#pricing'
                className='block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 ease-in-out hover:bg-accent hover:text-accent-foreground'
                onClick={toggleMenu}
              >
                Pricing
              </Link>
              <Link
                href='#wall-of-love'
                className='block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 ease-in-out hover:bg-accent hover:text-accent-foreground'
                onClick={toggleMenu}
              >
                Wall of love
              </Link>
              <Link
                href='#faq'
                className='block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 ease-in-out hover:bg-accent hover:text-accent-foreground'
                onClick={toggleMenu}
              >
                FAQ
              </Link>
              <Link
                href='/docs'
                className='block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 ease-in-out hover:bg-accent hover:text-accent-foreground'
                onClick={toggleMenu}
              >
                Docs
              </Link>
              <a
                href={`https://github.com/${repo}`}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground'
                onClick={toggleMenu}
              >
                <svg viewBox='0 0 16 16' className='h-4 w-4' fill='currentColor' aria-hidden='true'>
                  <path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z' />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
