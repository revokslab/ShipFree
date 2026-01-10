'use client'

import { Resend } from 'resend'

import { env } from '@/config/env'
import type {
  EmailOptions,
  EmailProvider,
  ProcessedEmailData,
  SendEmailResult,
  BatchSendEmailResult,
} from '../types'
import { getFromEmailAddress, hasNonEmpty } from '../utils'

let client: Resend | null = null

function getClient(): Resend | null {
  if (client) return client

  const apiKey = env.RESEND_API_KEY
  if (!hasNonEmpty(apiKey)) return null

  client = new Resend(apiKey)
  return client
}

async function send(data: ProcessedEmailData): Promise<SendEmailResult> {
  const resend = getClient()
  if (!resend) {
    throw new Error('Resend not configured')
  }

  const emailPayload = {
    from: data.senderEmail,
    to: data.to,
    subject: data.subject,
    html: data.html,
    text: data.text,
    replyTo: data.replyTo,
    headers: Object.keys(data.headers).length > 0 ? data.headers : undefined,
    attachments: data.attachments?.map((att) => ({
      filename: att.filename,
      content: typeof att.content === 'string' ? att.content : att.content.toString('base64'),
      contentType: att.contentType,
    })),
  }

  const { data: responseData, error } = await resend.emails.send(
    emailPayload as Parameters<typeof resend.emails.send>[0]
  )

  if (error) {
    throw new Error(error.message || 'Failed to send email via Resend')
  }

  return {
    success: true,
    message: 'Email sent successfully via Resend',
    data: responseData,
  }
}

async function sendBatch(emails: EmailOptions[]): Promise<BatchSendEmailResult> {
  const resend = getClient()
  if (!resend) {
    throw new Error('Resend not configured')
  }

  if (emails.length === 0) {
    return {
      success: true,
      message: 'No emails to send',
      results: [],
      data: { count: 0 },
    }
  }

  const batchPayload = emails.map((email) => {
    const senderEmail = email.from || getFromEmailAddress()
    return {
      from: senderEmail,
      to: email.to,
      subject: email.subject,
      html: email.html,
      text: email.text,
    }
  })

  const { data: responseData, error } = await resend.batch.send(
    batchPayload as Parameters<typeof resend.batch.send>[0],
    {
      batchValidation: 'permissive',
    }
  )

  if (error) {
    throw new Error(error.message || 'Resend batch API error')
  }

  const results: SendEmailResult[] = batchPayload.map((_, index) => ({
    success: true,
    message: 'Email sent successfully via Resend batch',
    data: { id: `batch-${index}` },
  }))

  return {
    success: true,
    message: 'All batch emails sent successfully via Resend',
    results,
    data: { count: batchPayload.length },
  }
}

export function createResendProvider(): EmailProvider | null {
  if (!getClient()) return null

  return {
    name: 'resend',
    send,
    sendBatch,
  }
}
