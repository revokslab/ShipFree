/**
 * Shared types for the email system.
 * This file contains all interfaces and types used across email providers.
 */

export type EmailType = 'transactional' | 'marketing' | 'updates' | 'notifications'

export type EmailProviderName = 'resend' | 'postmark' | 'nodemailer' | 'plunk' | 'custom' | 'log' | 'mailkite'

export interface EmailAttachment {
  filename: string
  content: string | Buffer
  contentType: string
  disposition?: 'attachment' | 'inline'
}

export interface UnsubscribeInfo {
  token: string
  writerId: string
  baseUrl?: string
}

export interface EmailOptions {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  from?: string
  emailType?: EmailType
  includeUnsubscribe?: boolean
  unsubscribeInfo?: UnsubscribeInfo
  attachments?: EmailAttachment[]
  replyTo?: string
}

export interface BatchEmailOptions {
  emails: EmailOptions[]
}

export interface SendEmailResult {
  success: boolean
  message: string
  data?: unknown
}

export interface BatchSendEmailResult {
  success: boolean
  message: string
  results: SendEmailResult[]
  data?: unknown
}

export interface ProcessedEmailData {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  senderEmail: string
  headers: Record<string, string>
  attachments?: EmailAttachment[]
  replyTo?: string
}

/**
 * Email provider interface.
 * All providers must implement this interface.
 * To add a new provider, create a file in the providers/ directory
 * and implement this interface.
 */
export interface EmailProvider {
  /** Unique identifier for the provider */
  name: EmailProviderName
  /** Send a single email */
  send: (data: ProcessedEmailData) => Promise<SendEmailResult>
  /** Optional batch send support */
  sendBatch?: (emails: EmailOptions[]) => Promise<BatchSendEmailResult>
}

/**
 * Provider factory function type.
 * Each provider module exports a create function that returns
 * either a provider instance or null if not configured.
 */
export type ProviderFactory = () => EmailProvider | null
