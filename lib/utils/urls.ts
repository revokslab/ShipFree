import { env } from '@/config/env'
import { isProd } from '@/lib/constants'

/**
 * Returns the base URL of the application from NEXT_PUBLIC_APP_URL
 * This ensures webhooks, callbacks, and other integrations always use the correct public URL
 * @returns The base URL string (e.g., 'http://localhost:3000' or 'https://example.com')
 * @throws Error if NEXT_PUBLIC_APP_URL is not configured
 */
export function getBaseUrl(): string {
  const baseUrl = env.NEXT_PUBLIC_APP_URL

  if (!baseUrl) {
    throw new Error(
      'NEXT_PUBLIC_APP_URL must be configured for webhooks and callbacks to work correctly'
    )
  }

  if (baseUrl.startsWith('http://') || baseUrl.startsWith('https://')) {
    return baseUrl
  }

  const protocol = isProd ? 'https://' : 'http://'
  return `${protocol}${baseUrl}`
}
