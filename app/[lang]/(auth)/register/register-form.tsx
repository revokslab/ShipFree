'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, ChevronRight, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { client } from '@/lib/auth/auth-client'
import { cn } from '@/lib/utils'
import { quickValidateEmail } from '@/lib/messaging/email/validation'
import { SocialLoginButtons } from '../components/social-login-buttons'

const validateEmailField = (emailValue: string): string[] => {
  const errors: string[] = []

  if (!emailValue || !emailValue.trim()) {
    errors.push('Email is required.')
    return errors
  }

  const validation = quickValidateEmail(emailValue.trim().toLowerCase())
  if (!validation.isValid) {
    errors.push(validation.reason || 'Please enter a valid email address.')
  }

  return errors
}

const PASSWORD_VALIDATIONS = {
  minLength: {
    test: (value: string) => value.length >= 8,
    message: 'Password must be at least 8 characters long.',
  },
}

const validatePassword = (passwordValue: string): string[] => {
  const errors: string[] = []

  if (!PASSWORD_VALIDATIONS.minLength.test(passwordValue)) {
    errors.push(PASSWORD_VALIDATIONS.minLength.message)
  }

  return errors
}

export default function RegisterForm({
  githubAvailable,
  googleAvailable,
  facebookAvailable,
  microsoftAvailable,
  isProduction,
}: {
  githubAvailable: boolean
  googleAvailable: boolean
  facebookAvailable: boolean
  microsoftAvailable: boolean
  isProduction: boolean
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isLoading, setIsLoading] = useState(false)
  const [, setMounted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [showValidationError, setShowValidationError] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)

  const [name, setName] = useState('')
  const [nameErrors, setNameErrors] = useState<string[]>([])
  const [showNameValidationError, setShowNameValidationError] = useState(false)

  const [email, setEmail] = useState('')
  const [emailErrors, setEmailErrors] = useState<string[]>([])
  const [showEmailValidationError, setShowEmailValidationError] = useState(false)

  const [callbackUrl, setCallbackUrl] = useState('/dashboard')

  useEffect(() => {
    setMounted(true)

    if (!searchParams) {
      return
    }

    const callback = searchParams.get('callbackUrl')
    if (callback?.startsWith('/')) {
      setCallbackUrl(callback)
    }
  }, [searchParams])

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setName(value)

    const trimmed = value.trim()
    const errors: string[] = []

    if (!trimmed) {
      errors.push('Name is required.')
    }

    setNameErrors(errors)
    setShowNameValidationError(false)
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value
    setEmail(newEmail)

    const errors = validateEmailField(newEmail)
    setEmailErrors(errors)
    setShowEmailValidationError(false)
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value
    setPassword(newPassword)

    const errors = validatePassword(newPassword)
    setPasswordErrors(errors)
    setShowValidationError(false)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const emailRaw = formData.get('email') as string
    const emailValue = emailRaw.trim().toLowerCase()
    const passwordValue = password
    const nameValue = (formData.get('name') as string).trim()

    const nameValidationErrors: string[] = []
    if (!nameValue) {
      nameValidationErrors.push('Name is required.')
    }
    setNameErrors(nameValidationErrors)
    setShowNameValidationError(nameValidationErrors.length > 0)

    const emailValidationErrors = validateEmailField(emailValue)
    setEmailErrors(emailValidationErrors)
    setShowEmailValidationError(emailValidationErrors.length > 0)

    const passwordValidationErrors = validatePassword(passwordValue)
    setPasswordErrors(passwordValidationErrors)
    setShowValidationError(passwordValidationErrors.length > 0)

    if (
      nameValidationErrors.length > 0 ||
      emailValidationErrors.length > 0 ||
      passwordValidationErrors.length > 0
    ) {
      setIsLoading(false)
      return
    }

    try {
      const response = await client.signUp.email(
        {
          email: emailValue,
          password: passwordValue,
          name: nameValue,
        },
        {}
      )

      if (!response || response.error) {
        setIsLoading(false)
        return
      }

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('verificationEmail', emailValue)
      }

      router.push('/verify?fromSignup=true')
    } catch (error) {
      console.error('Signup error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const hasSocial = githubAvailable || googleAvailable || facebookAvailable || microsoftAvailable
  const showDivider = hasSocial

  return (
    <>
      <div className='space-y-1 text-center'>
        <h1 className='font-medium text-[32px] text-black tracking-tight'>Create an account</h1>
        <p className='font-[380] text-[16px] text-muted-foreground'>Enter your details</p>
      </div>

      <form onSubmit={handleSubmit} className='mt-8 space-y-8'>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='name'>Full name</Label>
            </div>
            <Input
              id='name'
              name='name'
              placeholder='Enter your name'
              autoCapitalize='words'
              autoComplete='name'
              value={name}
              onChange={handleNameChange}
              size='lg'
              className={cn(
                'transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-100',
                showNameValidationError &&
                  nameErrors.length > 0 &&
                  'border-red-500 focus:border-red-500 focus:ring-red-100 focus-visible:ring-red-500'
              )}
            />
            {showNameValidationError && nameErrors.length > 0 && (
              <div className='mt-1 space-y-1 text-xs text-red-400'>
                {nameErrors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='email'>Email</Label>
            </div>
            <Input
              id='email'
              name='email'
              placeholder='Enter your email'
              required
              autoCapitalize='none'
              autoComplete='email'
              autoCorrect='off'
              value={email}
              onChange={handleEmailChange}
              size='lg'
              className={cn(
                'transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-100',
                showEmailValidationError &&
                  emailErrors.length > 0 &&
                  'border-red-500 focus:border-red-500 focus:ring-red-100 focus-visible:ring-red-500'
              )}
            />
            {showEmailValidationError && emailErrors.length > 0 && (
              <div className='mt-1 space-y-1 text-xs text-red-400'>
                {emailErrors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='password'>Password</Label>
            </div>
            <div className='relative'>
              <Input
                id='password'
                name='password'
                required
                type={showPassword ? 'text' : 'password'}
                autoCapitalize='none'
                autoComplete='new-password'
                autoCorrect='off'
                placeholder='Enter your password'
                value={password}
                size='lg'
                onChange={handlePasswordChange}
                className={cn(
                  'pr-10 transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-100',
                  showValidationError &&
                    passwordErrors.length > 0 &&
                    'border-red-500 focus:border-red-500 focus:ring-red-100 focus-visible:ring-red-500'
                )}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='-translate-y-1/2 absolute top-1/2 right-3 text-gray-500 transition hover:text-gray-700'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {showValidationError && passwordErrors.length > 0 && (
              <div className='mt-1 space-y-1 text-xs text-red-400'>
                {passwordErrors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        <Button
          type='submit'
          size='lg'
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          className='group inline-flex w-full items-center justify-center gap-2 rounded-[10px] py-[6px] pr-[10px] pl-[12px] text-[15px] text-white shadow-[inset_0_2px_4px_0_#9B77FF] transition-all'
          disabled={isLoading}
        >
          <span className='flex items-center gap-1'>
            {isLoading ? 'Creating account...' : 'Create account'}
            <span className='inline-flex transition-transform duration-200 group-hover:translate-x-0.5'>
              {isButtonHovered ? (
                <ArrowRight className='h-4 w-4' aria-hidden='true' />
              ) : (
                <ChevronRight className='h-4 w-4' aria-hidden='true' />
              )}
            </span>
          </span>
        </Button>
      </form>

      {showDivider && (
        <div className='relative my-6 font-light'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-200' />
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='bg-white px-4 font-[340] text-muted-foreground'>Or continue with</span>
          </div>
        </div>
      )}

      {hasSocial && (
        <div>
          <SocialLoginButtons
            googleAvailable={googleAvailable}
            githubAvailable={githubAvailable}
            facebookAvailable={facebookAvailable}
            microsoftAvailable={microsoftAvailable}
            isProduction={isProduction}
            callbackURL={callbackUrl}
          />
        </div>
      )}

      <div className='pt-6 text-center text-[14px] font-light'>
        <span className='font-normal'>Already have an account? </span>
        <Link
          href={`/login?callbackUrl=${callbackUrl}`}
          className='font-medium text-(--brand-accent-hex) underline-offset-4 transition hover:text-(--brand-accent-hover-hex) hover:underline'
        >
          Sign in
        </Link>
      </div>

      <div className='absolute inset-x-0 bottom-0 px-8 pb-8 text-center text-[13px] font-[340] leading-relaxed text-muted-foreground sm:px-8 md:px-[44px]'>
        By creating an account, you agree to our{' '}
        <Link
          href='/terms'
          target='_blank'
          rel='noopener noreferrer'
          className='text-(--brand-accent-hex) underline-offset-4 transition hover:text-(--brand-accent-hover-hex) hover:underline'
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href='/privacy'
          target='_blank'
          rel='noopener noreferrer'
          className='text-(--brand-accent-hex) underline-offset-4 transition hover:text-(--brand-accent-hover-hex) hover:underline'
        >
          Privacy Policy
        </Link>
      </div>
    </>
  )
}
