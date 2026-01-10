'use client'

import { type ReactNode, useEffect, useState } from 'react'
import { GitHubIcon, GoogleIcon, MicrosoftIcon, FacebookIcon } from './icons'
import { Button } from '@/components/ui/button'
import { client } from '@/lib/auth/auth-client'

interface SocialLoginButtonsProps {
  githubAvailable: boolean
  googleAvailable: boolean
  microsoftAvailable: boolean
  facebookAvailable: boolean
  callbackURL?: string
  isProduction: boolean
  children?: ReactNode
}

export function SocialLoginButtons({
  githubAvailable,
  googleAvailable,
  microsoftAvailable,
  facebookAvailable,
  callbackURL = '/dashboard',
  children,
}: SocialLoginButtonsProps) {
  const [isGithubLoading, setIsGithubLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isMicrosoftLoading, setIsMicrosoftLoading] = useState(false)
  const [isFacebookLoading, setIsFacebookLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Set mounted state to true on client-side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Only render on the client side to avoid hydration errors
  if (!mounted) return null

  async function signInWithGithub() {
    if (!githubAvailable) return

    setIsGithubLoading(true)
    try {
      await client.signIn.social({ provider: 'github', callbackURL })
    } catch (err: any) {
      let errorMessage = 'Failed to sign in with GitHub'

      if (err.message?.includes('account exists')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.'
      } else if (err.message?.includes('cancelled')) {
        errorMessage = 'GitHub sign in was cancelled. Please try again.'
      } else if (err.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.'
      } else if (err.message?.includes('rate limit')) {
        errorMessage = 'Too many attempts. Please try again later.'
      }
    } finally {
      setIsGithubLoading(false)
    }
  }

  async function signInWithGoogle() {
    if (!googleAvailable) return

    setIsGoogleLoading(true)
    try {
      await client.signIn.social({ provider: 'google', callbackURL })
    } catch (err: any) {
      let errorMessage = 'Failed to sign in with Google'

      if (err.message?.includes('account exists')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.'
      } else if (err.message?.includes('cancelled')) {
        errorMessage = 'Google sign in was cancelled. Please try again.'
      } else if (err.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.'
      } else if (err.message?.includes('rate limit')) {
        errorMessage = 'Too many attempts. Please try again later.'
      }
    } finally {
      setIsGoogleLoading(false)
    }
  }

  async function signInWithMicrosoft() {
    if (!microsoftAvailable) return

    setIsMicrosoftLoading(true)
    try {
      await client.signIn.social({ provider: 'microsoft', callbackURL })
    } catch (err: any) {
      let errorMessage = 'Failed to sign in with Microsoft'

      if (err.message?.includes('account exists')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.'
      } else if (err.message?.includes('cancelled')) {
        errorMessage = 'Microsoft sign in was cancelled. Please try again.'
      } else if (err.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.'
      } else if (err.message?.includes('rate limit')) {
        errorMessage = 'Too many attempts. Please try again later.'
      }
    } finally {
      setIsMicrosoftLoading(false)
    }
  }

  async function signInWithFacebook() {
    if (!facebookAvailable) return

    setIsFacebookLoading(true)
    try {
      await client.signIn.social({ provider: 'facebook', callbackURL })
    } catch (err: any) {
      let errorMessage = 'Failed to sign in with Facebook'

      if (err.message?.includes('account exists')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.'
      } else if (err.message?.includes('cancelled')) {
        errorMessage = 'Facebook sign in was cancelled. Please try again.'
      } else if (err.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.'
      } else if (err.message?.includes('rate limit')) {
        errorMessage = 'Too many attempts. Please try again later.'
      }
    } finally {
      setIsFacebookLoading(false)
    }
  }

  const githubButton = (
    <Button
      variant='outline'
      size='lg'
      className='w-full hover:bg-gray-50'
      disabled={!githubAvailable || isGithubLoading}
      onClick={signInWithGithub}
    >
      <GitHubIcon className='h-[18px]! w-[18px]! mr-1' />
      {isGithubLoading ? 'Connecting...' : 'GitHub'}
    </Button>
  )

  const googleButton = (
    <Button
      variant='outline'
      size='lg'
      className='w-full hover:bg-gray-50'
      disabled={!googleAvailable || isGoogleLoading}
      onClick={signInWithGoogle}
    >
      <GoogleIcon className='h-[18px]! w-[18px]! mr-1' />
      {isGoogleLoading ? 'Connecting...' : 'Google'}
    </Button>
  )

  const microsoftButton = (
    <Button
      variant='outline'
      size='lg'
      className='w-full rounded-[10px] shadow-sm hover:bg-gray-50'
      disabled={!microsoftAvailable || isMicrosoftLoading}
      onClick={signInWithMicrosoft}
    >
      <MicrosoftIcon className='h-[18px]! w-[18px]! mr-1' />
      {isMicrosoftLoading ? 'Connecting...' : 'Microsoft'}
    </Button>
  )

  const facebookButton = (
    <Button
      variant='outline'
      size='lg'
      className='w-full  hover:bg-gray-50'
      disabled={!facebookAvailable || isFacebookLoading}
      onClick={signInWithFacebook}
    >
      <FacebookIcon className='h-[18px]! w-[18px]! mr-1' />
      {isFacebookLoading ? 'Connecting...' : 'Facebook'}
    </Button>
  )

  const hasAnyOAuthProvider = githubAvailable || googleAvailable

  if (!hasAnyOAuthProvider && !children) {
    return null
  }

  return (
    <div className={`grid gap-3 font-light`}>
      {googleAvailable && googleButton}
      {githubAvailable && githubButton}
      {microsoftAvailable && microsoftButton}
      {facebookAvailable && facebookButton}
      {children}
    </div>
  )
}
