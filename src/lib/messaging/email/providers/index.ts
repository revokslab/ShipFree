/**
 * Email Providers Index
 *
 * This file exports all available email providers and provides
 * the registry for provider discovery.
 *
 * To add a new provider:
 * 1. Create a new file in this directory (e.g., sendgrid.ts)
 * 2. Implement the createXxxProvider function
 * 3. Add it to the providerFactories object below
 * 4. Add the provider name to EmailProviderName type in types.ts
 *
 * To remove a provider:
 * 1. Delete the provider file
 * 2. Remove it from the providerFactories object below
 * 3. Remove the provider name from EmailProviderName type in types.ts
 */

import type { EmailProvider, EmailProviderName } from '../types'

import { createResendProvider } from './resend'
import { createPostmarkProvider } from './postmark'
import { createNodemailerProvider } from './nodemailer'
import { createPlunkProvider } from './plunk'
import { createCustomProvider, setCustomEmailProvider, clearCustomProvider } from './custom'
import { createMailkiteProvider } from './mailkite'
import { createLogProvider } from './log'

/**
 * Registry of all available provider factories.
 * Each factory returns EmailProvider | null.
 */
const providerFactories: Record<EmailProviderName, () => EmailProvider | null> = {
  resend: createResendProvider,
  postmark: createPostmarkProvider,
  nodemailer: createNodemailerProvider,
  plunk: createPlunkProvider,
  custom: createCustomProvider,
  mailkite: createMailkiteProvider,
  log: createLogProvider,
}

/**
 * Default order of provider preference when auto-discovering.
 * The first configured provider will be used.
 */
export const providerPreferenceOrder: EmailProviderName[] = [
  'resend',
  'postmark',
  'nodemailer',
  'plunk',
  'custom',
  'mailkite',
  'log',
]

/**
 * Get a specific provider by name.
 * Returns null if the provider is not configured.
 */
export function getProvider(name: EmailProviderName): EmailProvider | null {
  const factory = providerFactories[name]
  if (!factory) return null
  return factory()
}

/**
 * Get the first available configured provider.
 * Falls back to log provider if none are configured.
 */
export function getFirstAvailableProvider(): EmailProvider {
  for (const name of providerPreferenceOrder) {
    const provider = getProvider(name)
    if (provider) return provider
  }
  // This should never happen since log provider always returns a valid provider
  return createLogProvider()
}

/**
 * Get all configured providers.
 * Useful for debugging or provider selection UI.
 */
export function getConfiguredProviders(): EmailProvider[] {
  const providers: EmailProvider[] = []
  for (const name of providerPreferenceOrder) {
    if (name === 'log') continue // Skip log provider in this list
    const provider = getProvider(name)
    if (provider) {
      providers.push(provider)
    }
  }
  return providers
}

/**
 * Check if any real email provider is configured.
 * Returns false if only the log provider is available.
 */
export function hasRealProvider(): boolean {
  for (const name of providerPreferenceOrder) {
    if (name === 'log') continue
    const provider = getProvider(name)
    if (provider) return true
  }
  return false
}

// Re-export provider factories for direct access
export {
  createResendProvider,
  createPostmarkProvider,
  createNodemailerProvider,
  createPlunkProvider,
  createCustomProvider,
  createMailkiteProvider,
  createLogProvider,
  setCustomEmailProvider,
  clearCustomProvider,
}
