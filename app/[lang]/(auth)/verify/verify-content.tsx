'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { cn } from '@/lib/utils'
import { useVerification } from './use-verification'

interface VerifyContentProps {
  isProduction: boolean
}

function VerificationForm({ isProduction }: { isProduction: boolean }) {
  const {
    otp,
    email,
    isLoading,
    isVerified,
    isInvalidOtp,
    errorMessage,
    isOtpComplete,
    verifyCode,
    resendCode,
    handleOtpChange,
  } = useVerification({ isProduction })

  const [countdown, setCountdown] = useState(0)
  const [isResendDisabled, setIsResendDisabled] = useState(false)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
    if (countdown === 0 && isResendDisabled) {
      setIsResendDisabled(false)
    }
  }, [countdown, isResendDisabled])

  const router = useRouter()

  const handleResend = () => {
    resendCode()
    setIsResendDisabled(true)
    setCountdown(30)
  }

  return (
    <>
      <div className='space-y-1 text-center'>
        <h1 className='font-medium text-[32px] text-black tracking-tight'>
          {isVerified ? 'Email Verified!' : 'Verify Your Email'}
        </h1>
        <p className='font-[380] text-[16px] text-muted-foreground'>
          {isVerified
            ? 'Your email has been verified. Redirecting to dashboard...'
            : `A verification code has been sent to ${email || 'your email'}`}
        </p>
      </div>

      {!isVerified && (
        <div className='mt-8 space-y-8'>
          <div className='space-y-6'>
            <p className='text-center text-muted-foreground text-sm'>
              Enter the 6-digit code to verify your account.
            </p>

            <div className='flex justify-center'>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={handleOtpChange}
                disabled={isLoading}
                className={cn('gap-2', isInvalidOtp && 'border-red-500')}
              >
                <InputOTPGroup className='gap-2 [&>div]:rounded-[10px]'>
                  <InputOTPSlot
                    index={0}
                    className={cn(
                      'h-12 w-12 rounded-[10px] border bg-white text-center font-medium text-lg shadow-sm transition-all duration-200',
                      'border-gray-300 hover:border-gray-400',
                      'focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100',
                      isInvalidOtp && 'border-red-500 focus:border-red-500 focus:ring-red-100'
                    )}
                  />
                  <InputOTPSlot
                    index={1}
                    className={cn(
                      'h-12 w-12 rounded-[10px] border bg-white text-center font-medium text-lg shadow-sm transition-all duration-200',
                      'border-gray-300 hover:border-gray-400',
                      'focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100',
                      isInvalidOtp && 'border-red-500 focus:border-red-500 focus:ring-red-100'
                    )}
                  />
                  <InputOTPSlot
                    index={2}
                    className={cn(
                      'h-12 w-12 rounded-[10px] border bg-white text-center font-medium text-lg shadow-sm transition-all duration-200',
                      'border-gray-300 hover:border-gray-400',
                      'focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100',
                      isInvalidOtp && 'border-red-500 focus:border-red-500 focus:ring-red-100'
                    )}
                  />
                  <InputOTPSlot
                    index={3}
                    className={cn(
                      'h-12 w-12 rounded-[10px] border bg-white text-center font-medium text-lg shadow-sm transition-all duration-200',
                      'border-gray-300 hover:border-gray-400',
                      'focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100',
                      isInvalidOtp && 'border-red-500 focus:border-red-500 focus:ring-red-100'
                    )}
                  />
                  <InputOTPSlot
                    index={4}
                    className={cn(
                      'h-12 w-12 rounded-[10px] border bg-white text-center font-medium text-lg shadow-sm transition-all duration-200',
                      'border-gray-300 hover:border-gray-400',
                      'focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100',
                      isInvalidOtp && 'border-red-500 focus:border-red-500 focus:ring-red-100'
                    )}
                  />
                  <InputOTPSlot
                    index={5}
                    className={cn(
                      'h-12 w-12 rounded-[10px] border bg-white text-center font-medium text-lg shadow-sm transition-all duration-200',
                      'border-gray-300 hover:border-gray-400',
                      'focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100',
                      isInvalidOtp && 'border-red-500 focus:border-red-500 focus:ring-red-100'
                    )}
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className='mt-1 space-y-1 text-center text-red-400 text-xs'>
                <p>{errorMessage}</p>
              </div>
            )}
          </div>

          <Button
            onClick={verifyCode}
            className='flex w-full items-center justify-center gap-2 rounded-[10px] py-[6px] pr-[10px] pl-[12px] text-[15px] font-medium text-white shadow-[inset_0_2px_4px_0_#9B77FF] transition-all'
            disabled={!isOtpComplete || isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </Button>

          <div className='text-center'>
            <p className='text-muted-foreground text-sm'>
              Didn't receive a code?{' '}
              {countdown > 0 ? (
                <span>
                  Resend in <span className='font-medium text-foreground'>{countdown}s</span>
                </span>
              ) : (
                <button
                  className='font-medium text-(--brand-accent-hex) underline-offset-4 transition hover:text-(--brand-accent-hover-hex) hover:underline'
                  onClick={handleResend}
                  disabled={isLoading || isResendDisabled}
                >
                  Resend
                </button>
              )}
            </p>
          </div>

          <div className='text-center font-light text-[14px]'>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  sessionStorage.removeItem('verificationEmail')
                  sessionStorage.removeItem('inviteRedirectUrl')
                  sessionStorage.removeItem('isInviteFlow')
                }
                router.push('/signup')
              }}
              className='font-medium text-(--brand-accent-hex) underline-offset-4 transition hover:text-(--brand-accent-hover-hex) hover:underline'
            >
              Back to signup
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function VerificationFormFallback() {
  return (
    <div className='text-center'>
      <div className='animate-pulse'>
        <div className='mx-auto mb-4 h-8 w-48 rounded bg-gray-200' />
        <div className='mx-auto h-4 w-64 rounded bg-gray-200' />
      </div>
    </div>
  )
}

export function VerifyContent({ isProduction }: VerifyContentProps) {
  return (
    <Suspense fallback={<VerificationFormFallback />}>
      <VerificationForm isProduction={isProduction} />
    </Suspense>
  )
}
