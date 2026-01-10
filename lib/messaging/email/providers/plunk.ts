/**
 * Plunk Email Provider
 *
 * Open-source email platform for developers.
 * https://useplunk.com
 *
 * To use this provider:
 * 1. Install: bun add @plunk/node
 * 2. Set environment variables:
 *    - PLUNK_API_KEY: Your Plunk API key
 * 3. Set EMAIL_PROVIDER=plunk in your .env
 *
 * To remove this provider if not needed:
 * 1. Delete this file
 * 2. Remove @plunk/node from package.json
 * 3. Remove PLUNK_* from your .env
 */

import Plunk from '@plunk/node'

import { env } from '@/config/env'
import type { EmailProvider, ProcessedEmailData, SendEmailResult } from '../types'
import { hasNonEmpty } from '../utils'

let client: Plunk | null = null

function getClient(): Plunk | null {
  if (client) return client

  const apiKey = env.PLUNK_API_KEY
  if (!hasNonEmpty(apiKey)) return null

  try {
    client = new Plunk(apiKey)
    return client
  } catch (error) {
    console.warn('Plunk client creation failed:', error)
    return null
  }
}

async function send(data: ProcessedEmailData): Promise<SendEmailResult> {
  const plunk = getClient()
  if (!plunk) {
    throw new Error('Plunk not configured')
  }

  // Plunk focuses on HTML; we pass HTML or text fallback
  const response = await plunk.emails.send({
    to: Array.isArray(data.to) ? data.to : [data.to],
    subject: data.subject,
    body: data.html || data.text || '',
    from: data.senderEmail,
  })

  return {
    success: true,
    message: 'Email sent successfully via Plunk',
    data: response,
  }
}

/**
 * Create the Plunk email provider.
 * Returns null if not configured.
 *
 * Note: Plunk does not support native batch sending.
 * Batch sends will fall back to individual sends.
 */
export function createPlunkProvider(): EmailProvider | null {
  if (!getClient()) return null

  return {
    name: 'plunk',
    send,
    // No native batch support - will use fallback sequential sending
  }
}
