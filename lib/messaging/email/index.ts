/**
 * Email Module
 *
 * Main entry point for email functionality.
 * This module supports multiple email providers with automatic fallback.
 *
 * Supported Providers:
 * - Resend (default)
 * - Postmark
 * - Nodemailer (SMTP)
 * - Plunk
 * - Custom (user-defined)
 * - Log (fallback for development)
 *
 * Usage:
 * ```ts
 * import { sendEmail, sendBatchEmails, hasEmailService } from "@/lib/messaging/email";
 *
 * // Check if email is configured
 * if (hasEmailService()) {
 *   await sendEmail({
 *     to: "user@example.com",
 *     subject: "Welcome!",
 *     html: "<h1>Welcome to our app!</h1>",
 *   });
 * }
 * ```
 *
 * Configuration:
 * Set EMAIL_PROVIDER in your .env to explicitly select a provider,
 * or leave it unset for auto-discovery based on available credentials.
 *
 * To Remove Unused Providers:
 * 1. Delete the provider file from ./providers/
 * 2. Remove the corresponding import from ./providers/index.ts
 * 3. Remove the corresponding env vars
 * 4. Uninstall the package if installed
 */

// Core mailer functions
export {
  sendEmail,
  sendBatchEmails,
  hasEmailService,
  getActiveProviderName,
} from './mailer'

// Types
export type {
  EmailType,
  EmailProviderName,
  EmailAttachment,
  UnsubscribeInfo,
  EmailOptions,
  BatchEmailOptions,
  SendEmailResult,
  BatchSendEmailResult,
  EmailProvider,
  ProcessedEmailData,
  ProviderFactory,
} from './types'

// Provider management (for custom provider injection)
export { setCustomEmailProvider, clearCustomProvider } from './providers'

// Provider utilities (for advanced use cases)
export {
  getProvider,
  getFirstAvailableProvider,
  getConfiguredProviders,
  hasRealProvider,
  providerPreferenceOrder,
} from './providers'

// Validation utilities
export { validateEmail, quickValidateEmail } from './validation'
export type { EmailValidationResult } from './validation'

// Utility functions
export { getFromEmailAddress, hasNonEmpty } from './utils'
