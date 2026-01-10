/**
 * Payment System Types
 *
 * Unified types for the payment system following Supastarter's architecture.
 * All payment providers implement the same interface for consistency.
 */

import type { PaymentProvider, PlanName } from '@/config/payments'

// Re-export for convenience
export type { PaymentProvider, PlanName } from '@/config/payments'

/**
 * Customer data structure
 */
export interface CustomerData {
  id: string
  providerCustomerId: string
  email?: string
  userId: string
  provider: PaymentProvider
}

/**
 * Subscription data structure
 */
export interface SubscriptionData {
  id: string
  providerSubscriptionId: string
  userId: string
  customerId?: string
  status: SubscriptionStatus
  plan: PlanName
  provider: PaymentProvider
  interval: 'month' | 'year' | null
  amount: number | null
  currency: string | null
  currentPeriodStart: Date | null
  currentPeriodEnd: Date | null
  cancelAtPeriodEnd: boolean
  canceledAt: Date | null
  trialStart: Date | null
  trialEnd: Date | null
}

/**
 * Payment data structure
 */
export interface PaymentData {
  id: string
  provider: PaymentProvider
  providerPaymentId: string
  userId: string
  customerId?: string
  subscriptionId?: string
  type: 'subscription' | 'one_time' | 'refund'
  status: PaymentStatus
  amount: number
  currency: string
  description?: string
}

/**
 * Subscription status values
 */
export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'past_due'
  | 'trialing'
  | 'incomplete'
  | 'paused'

/**
 * Payment status values
 */
export type PaymentStatus = 'succeeded' | 'pending' | 'failed' | 'canceled' | 'refunded'

/**
 * Checkout session options
 */
export interface CheckoutOptions {
  plan: PlanName
  successUrl?: string
  cancelUrl?: string
  trialDays?: number
  userId: string
  email?: string
}

/**
 * Checkout session result
 */
export interface CheckoutResult {
  url: string
  sessionId: string
}

/**
 * Portal session result
 */
export interface PortalResult {
  url: string
}

/**
 * Webhook event types
 */
export type WebhookEventType =
  | 'customer.created'
  | 'customer.updated'
  | 'customer.deleted'
  | 'subscription.created'
  | 'subscription.updated'
  | 'subscription.deleted'
  | 'subscription.canceled'
  | 'invoice.payment_succeeded'
  | 'invoice.payment_failed'
  | 'checkout.session.completed'
  | 'order.paid'

/**
 * Webhook event data
 */
export interface WebhookEvent {
  type: WebhookEventType
  provider: PaymentProvider
  data: any // Provider-specific event data
  rawEvent: any // Raw provider event
}

/**
 * Webhook processing result
 */
export interface WebhookResult {
  processed: boolean
  customer?: CustomerData
  subscription?: SubscriptionData
  payment?: PaymentData
  error?: string
}

/**
 * Payment Adapter Interface
 *
 * All payment providers must implement this interface.
 * This ensures consistent behavior across all providers.
 */
export interface PaymentAdapter {
  /** The payment provider name */
  readonly provider: PaymentProvider

  /**
   * Create a checkout session
   */
  createCheckout(options: CheckoutOptions): Promise<CheckoutResult>

  /**
   * Create or retrieve a customer
   */
  createCustomer(userId: string, email?: string): Promise<CustomerData>

  /**
   * Get subscription details
   */
  getSubscription(providerSubscriptionId: string): Promise<SubscriptionData | null>

  /**
   * Cancel a subscription
   */
  cancelSubscription(providerSubscriptionId: string, cancelAtPeriodEnd?: boolean): Promise<void>

  /**
   * Create a customer portal session
   */
  createPortal(customerId: string, returnUrl?: string): Promise<PortalResult>

  /**
   * Process a webhook event
   */
  processWebhook(event: WebhookEvent): Promise<WebhookResult>

  /**
   * Validate webhook signature (if applicable)
   */
  validateWebhook(rawBody: string, signature: string): Promise<boolean>
}

/**
 * Payment service configuration
 */
export interface PaymentServiceConfig {
  provider: PaymentProvider
  adapter: PaymentAdapter
}

/**
 * Database operation results
 */
export interface CreateCustomerResult {
  customer: CustomerData
  created: boolean // true if new, false if existing
}

export interface CreateSubscriptionResult {
  subscription: SubscriptionData
  created: boolean
}

export interface CreatePaymentResult {
  payment: PaymentData
  created: boolean
}
