'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { client, useSession } from '@/lib/auth/auth-client'

interface UseVerificationParams {
  isProduction: boolean
}

interface UseVerificationReturn {
  otp: string
  email: string
  isLoading: boolean
  isVerified: boolean
  isInvalidOtp: boolean
  errorMessage: string
  isOtpComplete: boolean
  isProduction: boolean
  verifyCode: () => Promise<void>
  resendCode: () => void
  handleOtpChange: (value: string) => void
}

export function useVerification({ isProduction }: UseVerificationParams): UseVerificationReturn {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refetch: refetchSession } = useSession()
  const [otp, setOtp] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isSendingInitialOtp, setIsSendingInitialOtp] = useState(false)
  const [isInvalidOtp, setIsInvalidOtp] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = sessionStorage.getItem('verificationEmail')
      if (storedEmail) {
        setEmail(storedEmail)
      }

      const storedRedirectUrl = sessionStorage.getItem('inviteRedirectUrl')
      if (storedRedirectUrl) {
        setRedirectUrl(storedRedirectUrl)
      }
    }

    const redirectParam = searchParams.get('redirectAfter')
    if (redirectParam) {
      setRedirectUrl(redirectParam)
    }
  }, [searchParams])

  useEffect(() => {
    if (email && !isSendingInitialOtp) {
      setIsSendingInitialOtp(true)
    }
  }, [email, isSendingInitialOtp])

  const isOtpComplete = otp.length === 6

  async function verifyCode() {
    if (!isOtpComplete || !email) return

    setIsLoading(true)
    setIsInvalidOtp(false)
    setErrorMessage('')

    try {
      const normalizedEmail = email.trim().toLowerCase()
      const response = await client.signIn.emailOtp({
        email: normalizedEmail,
        otp,
      })

      if (response && !response.error) {
        setIsVerified(true)

        try {
          await refetchSession()
        } catch (e) {
          console.warn('Failed to refetch session after verification', e)
        }

        setTimeout(() => {
          if (redirectUrl) {
            window.location.href = redirectUrl
          } else {
            window.location.href = '/dashboard'
          }
        }, 1000)
      } else {
        console.info('Setting invalid OTP state - API error response')
        const message = 'Invalid verification code. Please check and try again.'
        setIsInvalidOtp(true)
        setErrorMessage(message)
        console.info('Error state after API error:', {
          isInvalidOtp: true,
          errorMessage: message,
        })
        setOtp('')
      }
    } catch (error: any) {
      let message = 'Verification failed. Please check your code and try again.'

      if (error.message?.includes('expired')) {
        message = 'The verification code has expired. Please request a new one.'
      } else if (error.message?.includes('invalid')) {
        console.info('Setting invalid OTP state - caught error')
        message = 'Invalid verification code. Please check and try again.'
      } else if (error.message?.includes('attempts')) {
        message = 'Too many failed attempts. Please request a new code.'
      }

      setIsInvalidOtp(true)
      setErrorMessage(message)
      console.info('Error state after caught error:', {
        isInvalidOtp: true,
        errorMessage: message,
      })

      setOtp('')
    } finally {
      setIsLoading(false)
    }
  }

  function resendCode() {
    if (!email) return

    setIsLoading(true)
    setErrorMessage('')

    const normalizedEmail = email.trim().toLowerCase()
    client.emailOtp
      .sendVerificationOtp({
        email: normalizedEmail,
        type: 'sign-in',
      })
      .then(() => {})
      .catch(() => {
        setErrorMessage('Failed to resend verification code. Please try again later.')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function handleOtpChange(value: string) {
    if (value.length === 6) {
      setIsInvalidOtp(false)
      setErrorMessage('')
    }
    setOtp(value)
  }

  useEffect(() => {
    if (otp.length === 6 && email && !isLoading && !isVerified) {
      const timeoutId = setTimeout(() => {
        verifyCode()
      }, 300)

      return () => clearTimeout(timeoutId)
    }
  }, [otp, email, isLoading, isVerified])

  return {
    otp,
    email,
    isLoading,
    isVerified,
    isInvalidOtp,
    errorMessage,
    isOtpComplete,
    isProduction,
    verifyCode,
    resendCode,
    handleOtpChange,
  }
}
