import type { MetadataRoute } from 'next'
import { getBrandConfig } from '@/config/branding'

export default function manifest(): MetadataRoute.Manifest {
  const brand = getBrandConfig()

  return {
    name: brand.name,
    short_name: brand.name,
    description:
      'ShipFree is a free open-source Next.js SaaS boilerplate alternative to ShipFast. Simplify and optimize your shipping process with modern web technologies like Supabase, Stripe, LemonSqueezy, Drizzle ORM, and Mailgun.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: brand.theme?.primaryColor,
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/favicon/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/favicon/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    categories: ['developer tools', 'productivity', 'saas'],
    shortcuts: [
      {
        name: 'Open dashboard',
        short_name: 'Dashboard',
        description: 'Go to your ShipFree dashboard',
        url: '/dashboard',
      },
    ],
    lang: 'en-US',
    dir: 'ltr',
  }
}
