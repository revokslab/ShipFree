'use client'

import AuthBackground from './components/auth-background'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthBackground>
      <main className='relative flex min-h-screen flex-col text-foreground'>
        {/* Content */}
        <div className='relative z-30 flex flex-1 items-center justify-center px-4 pb-24'>
          <div className='w-full max-w-lg px-4'>{children}</div>
        </div>
      </main>
    </AuthBackground>
  )
}
