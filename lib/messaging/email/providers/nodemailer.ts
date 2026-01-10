/**
 * Nodemailer Email Provider
 *
 * Generic SMTP client for sending emails through any SMTP server.
 * https://nodemailer.com
 *
 * To use this provider:
 * 1. Install: bun add nodemailer && bun add -D @types/nodemailer
 * 2. Set environment variables:
 *    - SMTP_HOST: Your SMTP server host
 *    - SMTP_PORT: Your SMTP server port
 *    - SMTP_USER: SMTP username
 *    - SMTP_PASS: SMTP password
 *    - SMTP_SECURE: "true" for TLS, "false" for STARTTLS (optional)
 * 3. Set EMAIL_PROVIDER=nodemailer in your .env
 *
 * To remove this provider if not needed:
 * 1. Delete this file
 * 2. Remove nodemailer from package.json
 * 3. Remove SMTP_* from your .env
 */

import type nodemailer from 'nodemailer'

import { env } from '@/config/env'
import type {
  EmailOptions,
  EmailProvider,
  ProcessedEmailData,
  SendEmailResult,
  BatchSendEmailResult,
} from '../types'
import { getFromEmailAddress, hasNonEmpty } from '../utils'

let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter

  if (
    !hasNonEmpty(env.SMTP_HOST) ||
    !env.SMTP_PORT ||
    !hasNonEmpty(env.SMTP_USER) ||
    !hasNonEmpty(env.SMTP_PASS)
  ) {
    return null
  }

  try {
    const nodemailerModule = require('nodemailer') as typeof nodemailer
    transporter = nodemailerModule.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      secure: env.SMTP_SECURE === 'true',
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    })
    return transporter
  } catch (error) {
    console.warn('Nodemailer transporter creation failed:', error)
    return null
  }
}

async function send(data: ProcessedEmailData): Promise<SendEmailResult> {
  const transport = getTransporter()
  if (!transport) {
    throw new Error('Nodemailer not configured')
  }

  const info = await transport.sendMail({
    from: data.senderEmail,
    to: data.to,
    subject: data.subject,
    html: data.html,
    text: data.text,
    headers: data.headers,
    replyTo: data.replyTo,
    attachments: data.attachments?.map((att) => ({
      filename: att.filename,
      content: att.content,
      contentType: att.contentType,
      disposition: att.disposition,
    })),
  })

  return {
    success: true,
    message: 'Email sent successfully via Nodemailer',
    data: info,
  }
}

async function sendBatch(emails: EmailOptions[]): Promise<BatchSendEmailResult> {
  const results: SendEmailResult[] = []

  for (const email of emails) {
    const senderEmail = email.from || getFromEmailAddress()
    const singleResult = await send({
      to: email.to,
      subject: email.subject,
      html: email.html,
      text: email.text,
      senderEmail,
      headers: {},
      attachments: email.attachments,
      replyTo: email.replyTo,
    })
    results.push(singleResult)
  }

  const successCount = results.filter((r) => r.success).length
  return {
    success: successCount === results.length,
    message:
      successCount === results.length
        ? 'All batch emails sent successfully via Nodemailer'
        : `${successCount}/${results.length} emails sent successfully via Nodemailer`,
    results,
    data: { count: successCount },
  }
}

/**
 * Create the Nodemailer email provider.
 * Returns null if not configured.
 */
export function createNodemailerProvider(): EmailProvider | null {
  if (!getTransporter()) return null

  return {
    name: 'nodemailer',
    send,
    sendBatch,
  }
}
