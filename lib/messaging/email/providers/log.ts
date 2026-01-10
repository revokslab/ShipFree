/**
 * Log Email Provider (Fallback)
 *
 * Development/fallback provider that logs emails instead of sending them.
 * Used when no other provider is configured.
 *
 * This provider:
 * - Never actually sends emails
 * - Logs email details to console
 * - Always returns success
 * - Useful for development and testing
 *
 * To use this provider explicitly:
 * Set EMAIL_PROVIDER=log in your .env
 *
 * Note: This provider is automatically used when no other
 * provider is configured.
 */

import type {
  EmailOptions,
  EmailProvider,
  ProcessedEmailData,
  SendEmailResult,
  BatchSendEmailResult,
} from '../types'

async function send(data: ProcessedEmailData): Promise<SendEmailResult> {
  console.info('📧 Email not sent (log provider):', {
    to: data.to,
    subject: data.subject,
    from: data.senderEmail,
    hasHtml: !!data.html,
    hasText: !!data.text,
    attachments: data.attachments?.length || 0,
  })

  return {
    success: true,
    message: 'Email logged (no provider configured)',
    data: { id: `mock-${Date.now()}` },
  }
}

async function sendBatch(emails: EmailOptions[]): Promise<BatchSendEmailResult> {
  console.info('📧 Batch email not sent (log provider):', {
    count: emails.length,
    subjects: emails.map((e) => e.subject),
  })

  const results: SendEmailResult[] = emails.map((_, index) => ({
    success: true,
    message: 'Email logged (no provider configured)',
    data: { id: `mock-batch-${Date.now()}-${index}` },
  }))

  return {
    success: true,
    message: 'Batch email logged (no provider configured)',
    results,
    data: { count: emails.length },
  }
}

/**
 * Create the log (fallback) email provider.
 * Always returns a valid provider.
 */
export function createLogProvider(): EmailProvider {
  return {
    name: 'log',
    send,
    sendBatch,
  }
}
