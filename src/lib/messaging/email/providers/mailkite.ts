/**
 * MailKite Email Provider
 *
 * Inbound-first email for developers — receive email as a webhook, send with one API.
 * https://mailkite.dev
 *
 * To use this provider:
 * 1. Set environment variables:
 *    - MAILKITE_API_KEY: Your MailKite API key (account settings → API keys)
 * 2. Set EMAIL_PROVIDER=mailkite in your .env
 *
 * The provider posts to MailKite's /v1/send endpoint with the account key as a
 * Bearer token. Sending is gated on a verified domain — the `from` address must be
 * on a domain you've verified in MailKite (SPF + DKIM).
 */

import { env } from '@/config/env'
import type { EmailProvider, ProcessedEmailData, SendEmailResult } from '../types'
import { hasNonEmpty } from '../utils'

const MAILKITE_API_URL = 'https://api.mailkite.dev/v1/send'

let client: { apiKey: string } | null = null

function getClient(): { apiKey: string } | null {
  if (client) return client

  const apiKey = env.MAILKITE_API_KEY
  if (!hasNonEmpty(apiKey)) return null

  client = { apiKey }
  return client
}

async function send(data: ProcessedEmailData): Promise<SendEmailResult> {
  const c = getClient()
  if (!c) {
    throw new Error('MailKite not configured')
  }

  const response = await fetch(MAILKITE_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${c.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: data.senderEmail,
      to: data.to,
      subject: data.subject,
      html: data.html,
      text: data.text,
      replyTo: data.replyTo,
      headers: Object.keys(data.headers).length > 0 ? data.headers : undefined,
      attachments: data.attachments?.map((att) => ({
        filename: att.filename,
        contentType: att.contentType,
        content:
          typeof att.content === 'string'
            ? Buffer.from(att.content, 'utf8').toString('base64')
            : att.content.toString('base64'),
      })),
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Failed to send email via MailKite (${response.status}): ${body}`)
  }

  const result = (await response.json().catch(() => null)) as unknown

  return {
    success: true,
    message: 'Email sent successfully via MailKite',
    data: result,
  }
}

/**
 * Create the MailKite email provider.
 * Returns null if not configured.
 *
 * Note: batch sending falls back to sequential individual sends.
 */
export function createMailkiteProvider(): EmailProvider | null {
  if (!getClient()) return null

  return {
    name: 'mailkite',
    send,
  }
}
