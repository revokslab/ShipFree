import Link from 'next/link'
import { CreditCard, Settings, User } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className='container mx-auto py-8 px-4 max-w-4xl'>
      <h1 className='text-3xl font-bold tracking-tight mb-2'>Dashboard</h1>
      <p className='text-muted-foreground mb-8'>Welcome to your dashboard</p>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {/* Billing Demo Card */}
        <Link
          href='/dashboard/billing'
          className='group rounded-lg border p-6 hover:border-primary hover:bg-muted/50 transition-colors'
        >
          <div className='flex items-center gap-3 mb-3'>
            <div className='p-2 rounded-lg bg-primary/10 text-primary'>
              <CreditCard className='h-5 w-5' />
            </div>
            <h2 className='text-lg font-semibold group-hover:text-primary transition-colors'>
              Billing Demo
            </h2>
          </div>
          <p className='text-sm text-muted-foreground'>
            Explore the billing system integration with better-auth payment plugins.
          </p>
        </Link>

        {/* Profile Card (placeholder) */}
        <div className='rounded-lg border p-6 opacity-60'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='p-2 rounded-lg bg-muted'>
              <User className='h-5 w-5' />
            </div>
            <h2 className='text-lg font-semibold'>Profile</h2>
          </div>
          <p className='text-sm text-muted-foreground'>Manage your account settings.</p>
        </div>

        {/* Settings Card (placeholder) */}
        <div className='rounded-lg border p-6 opacity-60'>
          <div className='flex items-center gap-3 mb-3'>
            <div className='p-2 rounded-lg bg-muted'>
              <Settings className='h-5 w-5' />
            </div>
            <h2 className='text-lg font-semibold'>Settings</h2>
          </div>
          <p className='text-sm text-muted-foreground'>Configure your preferences.</p>
        </div>
      </div>
    </div>
  )
}
