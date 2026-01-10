/**
 * Email Mailer - Core email sending functionality
 *
 * This module provides the main API for sending emails.
 * It uses the provider system to support multiple email services.
 *
 * Usage:
 * ```ts
 * import { sendEmail, sendBatchEmails } from "@/lib/messaging/email";
 *
 * // Send a single email
 * await sendEmail({
 *   to: "user@example.com",
 *   subject: "Hello",
 *   html: "<p>Hello World</p>",
 * });
 *
 * // Send batch emails
 * await sendBatchEmails({
 *   emails: [
 *     { to: "user1@example.com", subject: "Hello 1", html: "<p>Hi</p>" },
 *     { to: "user2@example.com", subject: "Hello 2", html: "<p>Hi</p>" },
 *   ],
 * });
 * ```
 */

import { env } from '@/config/env'

import type {
  EmailOptions,
  BatchEmailOptions,
  SendEmailResult,
  BatchSendEmailResult,
  ProcessedEmailData,
  EmailProvider,
  EmailProviderName,
} from './types'

import { getFromEmailAddress } from './utils'
import {
  getProvider,
  getFirstAvailableProvider,
  hasRealProvider,
  providerPreferenceOrder,
  createLogProvider,
} from './providers'

/**
 * Resolve the provider name from environment configuration.
 */
function resolveProviderNameFromEnv(): EmailProviderName | null {
  const fromEnv = env.EMAIL_PROVIDER?.toLowerCase() as EmailProviderName | undefined
  if (!fromEnv) return null
  if (providerPreferenceOrder.includes(fromEnv)) return fromEnv
  return null
}

/**
 * Get the configured email provider based on environment settings.
 * Uses explicit EMAIL_PROVIDER if set, otherwise auto-discovers.
 */
function getConfiguredProvider(): EmailProvider {
  const explicitName = resolveProviderNameFromEnv()

  // If explicit provider is set, try to use it
  if (explicitName) {
    const explicitProvider = getProvider(explicitName)
    if (explicitProvider) return explicitProvider
    console.warn(
      `Configured provider "${explicitName}" is not available, falling back to auto-discovery`
    )
  }

  // Auto-discover first available provider
  return getFirstAvailableProvider()
}

/**
 * Process email options into the internal format.
 */
async function processEmailData(options: EmailOptions): Promise<ProcessedEmailData> {
  const {
    to,
    subject,
    html,
    text,
    from,
    emailType = 'transactional',
    includeUnsubscribe = true,
    unsubscribeInfo,
    attachments,
    replyTo,
  } = options

  const senderEmail = from || getFromEmailAddress()

  let headers: Record<string, string> = {}

  // Add unsubscribe headers for marketing emails
  if (includeUnsubscribe && emailType !== 'transactional' && unsubscribeInfo) {
    const baseUrl = unsubscribeInfo.baseUrl
    const unsubscribeUrl = `${baseUrl}/unsubscribe?token=${unsubscribeInfo.token}&writer=${unsubscribeInfo.writerId}`

    headers = {
      'List-Unsubscribe': `<${unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    }
  }

  return {
    to,
    subject,
    html,
    text,
    senderEmail,
    headers,
    attachments,
    replyTo,
  }
}

/**
 * Check if any email service is configured and available.
 */
export function hasEmailService(): boolean {
  return hasRealProvider()
}

/**
 * Send a single email.
 *
 * @param options - Email options
 * @returns Result of the send operation
 */
export async function sendEmail(options: EmailOptions): Promise<SendEmailResult> {
  try {
    const processedData = await processEmailData(options)
    const provider = getConfiguredProvider()

    try {
      return await provider.send(processedData)
    } catch (error) {
      console.error(`Primary email provider "${provider.name}" failed:`, error)

      // If not already using log provider, fall back to it
      if (provider.name !== 'log') {
        console.info('Falling back to log provider')
        const logProvider = createLogProvider()
        return logProvider.send(processedData)
      }

      throw error
    }
  } catch (error) {
    console.error('Error sending email:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send email',
    }
  }
}

/**
 * Send multiple emails in batch.
 *
 * If the provider supports batch sending, it will be used.
 * Otherwise, emails are sent sequentially.
 *
 * @param options - Batch email options
 * @returns Result of the batch send operation
 */
export async function sendBatchEmails(options: BatchEmailOptions): Promise<BatchSendEmailResult> {
  try {
    const provider = getConfiguredProvider()

    // Use native batch if available
    if (provider.sendBatch) {
      try {
        return await provider.sendBatch(options.emails)
      } catch (error) {
        console.warn(
          `Provider "${provider.name}" batch send failed, falling back to sequential:`,
          error
        )
      }
    }

    // Fall back to sequential sending
    const results: SendEmailResult[] = []

    for (const email of options.emails) {
      try {
        const result = await sendEmail(email)
        results.push(result)
      } catch (error) {
        results.push({
          success: false,
          message: error instanceof Error ? error.message : 'Failed to send email',
        })
      }
    }

    const successCount = results.filter((r) => r.success).length
    return {
      success: successCount === results.length,
      message:
        successCount === results.length
          ? 'All batch emails sent successfully'
          : `${successCount}/${results.length} emails sent successfully`,
      results,
      data: { count: successCount },
    }
  } catch (error) {
    console.error('Error in batch email sending:', error)
    return {
      success: false,
      message: 'Failed to send batch emails',
      results: [],
    }
  }
}

/**
 * Get the name of the currently configured provider.
 * Useful for debugging or displaying provider status.
 */
export function getActiveProviderName(): EmailProviderName {
  return getConfiguredProvider().name
}
