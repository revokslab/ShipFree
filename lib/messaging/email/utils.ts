/**
 * Email utility functions.
 */

import { env } from '@/config/env'

/**
 * Check if a string value is non-empty and not a placeholder.
 */
export function hasNonEmpty(value: string | undefined): value is string {
  return !!value && value !== 'placeholder' && value.trim() !== ''
}

/**
 * Get the default from email address.
 * Falls back to a constructed address using the Resend domain or a default.
 */
export function getFromEmailAddress(): string {
  const fromName = env.DEFAULT_FROM_NAME || 'ShipFree'
  const fromEmail =
    env.DEFAULT_FROM_EMAIL ||
    (env.RESEND_DOMAIN ? `noreply@${env.RESEND_DOMAIN}` : 'noreply@example.com')

  return `${fromName} <${fromEmail}>`
}
