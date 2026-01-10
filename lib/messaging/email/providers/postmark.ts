/**
 * Postmark Email Provider
 *
 * Transactional email service known for deliverability.
 * https://postmarkapp.com
 *
 * To use this provider:
 * 1. Install: bun add postmark
 * 2. Set environment variables:
 *    - POSTMARK_API_TOKEN: Your Postmark server API token
 * 3. Set EMAIL_PROVIDER=postmark in your .env
 *
 * To remove this provider if not needed:
 * 1. Delete this file
 * 2. Remove postmark from package.json
 * 3. Remove POSTMARK_* from your .env
 */

import type { ServerClient as PostmarkClient } from 'postmark'

import { env } from '@/config/env'
import type {
  EmailOptions,
  EmailProvider,
  ProcessedEmailData,
  SendEmailResult,
  BatchSendEmailResult,
} from '../types'
import { getFromEmailAddress, hasNonEmpty } from '../utils'

let client: PostmarkClient | null = null

function getClient(): PostmarkClient | null {
  if (client) return client

  const apiToken = env.POSTMARK_API_TOKEN
  if (!hasNonEmpty(apiToken)) return null

  try {
    const { ServerClient } = require('postmark') as {
      ServerClient: new (token: string) => PostmarkClient
    }
    client = new ServerClient(apiToken)
    return client
  } catch (error) {
    console.warn('Postmark client creation failed:', error)
    return null
  }
}

async function send(data: ProcessedEmailData): Promise<SendEmailResult> {
  const postmark = getClient()
  if (!postmark) {
    throw new Error('Postmark not configured')
  }

  const response = await postmark.sendEmail({
    From: data.senderEmail,
    To: Array.isArray(data.to) ? data.to.join(',') : data.to,
    Subject: data.subject,
    HtmlBody: data.html,
    TextBody: data.text,
    Headers:
      Object.keys(data.headers).length > 0
        ? Object.entries(data.headers).map(([Name, Value]) => ({
            Name,
            Value,
          }))
        : undefined,
    ReplyTo: data.replyTo,
    Attachments: data.attachments?.map((att) => ({
      Name: att.filename,
      Content: typeof att.content === 'string' ? att.content : att.content.toString('base64'),
      ContentType: att.contentType,
      ContentID: att.disposition === 'inline' ? att.filename : null,
    })),
  })

  return {
    success: true,
    message: 'Email sent successfully via Postmark',
    data: response,
  }
}

async function sendBatch(emails: EmailOptions[]): Promise<BatchSendEmailResult> {
  const postmark = getClient()
  if (!postmark) {
    throw new Error('Postmark not configured')
  }

  if (emails.length === 0) {
    return {
      success: true,
      message: 'No emails to send',
      results: [],
      data: { count: 0 },
    }
  }

  const batch = emails.map((email) => ({
    From: email.from || getFromEmailAddress(),
    To: Array.isArray(email.to) ? email.to.join(',') : email.to,
    Subject: email.subject,
    HtmlBody: email.html,
    TextBody: email.text,
  }))

  const response = await postmark.sendEmailBatch(batch)

  const results: SendEmailResult[] = response.map(() => ({
    success: true,
    message: 'Email sent successfully via Postmark batch',
  }))

  return {
    success: true,
    message: 'All batch emails sent successfully via Postmark',
    results,
    data: { count: emails.length },
  }
}

/**
 * Create the Postmark email provider.
 * Returns null if not configured.
 */
export function createPostmarkProvider(): EmailProvider | null {
  if (!getClient()) return null

  return {
    name: 'postmark',
    send,
    sendBatch,
  }
}
