/**
 * Lemon Squeezy Payment Adapter
 *
 * Implements the PaymentAdapter interface for Lemon Squeezy integration.
 * Handles checkout sessions, customers, subscriptions, and webhooks.
 *
 * Dependency: @lemonsqueezy/lemonsqueezy.js
 */

import {
  lemonSqueezySetup,
  createCheckout,
  getSubscription,
  cancelSubscription,
  listCustomers,
  type NewCheckout,
} from '@lemonsqueezy/lemonsqueezy.js'
import type {
  PaymentAdapter,
  CheckoutOptions,
  CheckoutResult,
  CustomerData,
  SubscriptionData,
  PortalResult,
  WebhookEvent,
  WebhookResult,
} from '../types'
import type { PaymentProvider, PlanName } from '@/config/payments'
import { getPriceConfig, paymentConfig } from '@/config/payments'
import crypto from 'crypto'

export class LemonSqueezyAdapter implements PaymentAdapter {
  public readonly provider: PaymentProvider = 'lemonsqueezy'

  constructor() {
    // We access env vars directly here as they might be set at runtime
    // Note: configure this in your entry point if possible, but safe here too
    if (process.env.LEMONSQUEEZY_API_KEY) {
      lemonSqueezySetup({
        apiKey: process.env.LEMONSQUEEZY_API_KEY,
        onError: (error: any) => console.error('Lemon Squeezy API Error:', error),
      })
    }
  }

  async createCheckout(options: CheckoutOptions): Promise<CheckoutResult> {
    const { plan, successUrl, cancelUrl, userId, email } = options

    // Get price configuration for this plan
    const prices = getPriceConfig(plan, 'lemonsqueezy')
    if (prices.length === 0) {
      throw new Error(`No Lemon Squeezy prices configured for plan: ${plan}`)
    }

    // Use the first price (monthly)
    const price = prices.find((p: any) => p.interval === 'month') || prices[0]

    if (!price.productId) {
      throw new Error(`No product ID configured for plan ${plan}`)
    }

    // We use variant ID for checkouts in Lemon Squeezy (productId in config acts as variant ID)
    const storeId = process.env.LEMONSQUEEZY_STORE_ID
    if (!storeId) {
      throw new Error('LEMONSQUEEZY_STORE_ID is required')
    }

    const newCheckout: NewCheckout = {
      productOptions: {
        redirectUrl: successUrl || paymentConfig.providers.successUrl,
        receiptButtonText: 'Go to Dashboard',
        receiptLinkUrl: paymentConfig.providers.successUrl,
      },
      checkoutData: {
        email,
        custom: {
          userId,
          plan,
          provider: 'lemonsqueezy',
        },
      },
      checkoutOptions: {
        embed: false,
        media: false,
        logo: true,
      },
    }

    const { data, error } = await createCheckout(
      storeId,
      Number.parseInt(price.productId),
      newCheckout
    )

    if (error || !data) {
      console.error('Lemon Squeezy checkout creation error:', error)
      throw new Error('Failed to create Lemon Squeezy checkout session')
    }

    return {
      url: data.data.attributes.url,
      sessionId: data.data.id,
    }
  }

  async createCustomer(userId: string, email?: string): Promise<CustomerData> {
    // Lemon Squeezy customers are typically created via checkout, but can be created manually
    // We'll try to find an existing one or create a new one
    const storeId = process.env.LEMONSQUEEZY_STORE_ID
    if (!storeId) throw new Error('LEMONSQUEEZY_STORE_ID is required')

    if (email) {
      const { data } = await listCustomers({
        filter: { email },
        page: { size: 1 },
      })

      if (data?.data && data.data.length > 0) {
        const customer = data.data[0]
        return {
          id: `ls_${customer.id}`,
          providerCustomerId: customer.id,
          email: customer.attributes.email,
          userId,
          provider: 'lemonsqueezy',
        }
      }
    }

    // If no email or not found, we return a placeholder
    // Real customer ID will be linked after first checkout/webhook
    const customerId = `ls_pending_${userId}`
    return {
      id: customerId,
      providerCustomerId: customerId,
      email,
      userId,
      provider: 'lemonsqueezy',
    }
  }

  async getSubscription(providerSubscriptionId: string): Promise<SubscriptionData | null> {
    const { data, error } = await getSubscription(providerSubscriptionId)

    if (error || !data) {
      return null
    }

    const sub = data.data
    const attrs = sub.attributes
    const plan = this.mapVariantToPlan(attrs.variant_id.toString())

    return {
      id: `ls_${sub.id}`,
      providerSubscriptionId: sub.id,
      userId: '', // Lemon Squeezy doesn't return custom data in subscription object directly
      customerId: `ls_${attrs.customer_id}`,
      status: this.mapStatus(attrs.status),
      plan,
      provider: 'lemonsqueezy',
      interval: attrs.variant_name.toLowerCase().includes('year') ? 'year' : 'month', // Heuristic
      amount: null, // Needs variant lookup
      currency: null,
      currentPeriodStart: new Date(attrs.renews_at), // Approximation
      currentPeriodEnd: new Date(attrs.renews_at),
      cancelAtPeriodEnd: attrs.cancelled,
      canceledAt: attrs.ends_at ? new Date(attrs.ends_at) : null,
      trialStart: attrs.trial_ends_at ? new Date() : null, // Not directly available
      trialEnd: attrs.trial_ends_at ? new Date(attrs.trial_ends_at) : null,
    }
  }

  async cancelSubscription(
    providerSubscriptionId: string,
    cancelAtPeriodEnd = true
  ): Promise<void> {
    // Lemon Squeezy only supports cancelling at period end via API easily
    // Immediate cancellation might require different handling
    const { error } = await cancelSubscription(providerSubscriptionId)
    if (error) {
      throw new Error(`Failed to cancel subscription: ${error.message}`)
    }
  }

  async createPortal(customerId: string, returnUrl?: string): Promise<PortalResult> {
    // Lemon Squeezy uses a magic link for customer portal
    // This is typically available on the subscription object or customer object
    // For now, we'll return a generic URL or throw if not available
    const { data } = await listCustomers({
      filter: { email: customerId }, // Assuming customerId passed is email or we look up by ID
    })

    const url = data?.data[0]?.attributes.urls?.customer_portal
    if (!url) {
      throw new Error('Customer portal URL not found')
    }

    return { url }
  }

  async processWebhook(event: WebhookEvent): Promise<WebhookResult> {
    // Raw event body should be passed
    const body = event.rawEvent
    const eventName = body.meta.event_name
    const data = body.data

    switch (eventName) {
      case 'subscription_created':
      case 'subscription_updated':
      case 'subscription_cancelled':
      case 'subscription_expired': {
        const attrs = data.attributes
        const plan = this.mapVariantToPlan(attrs.variant_id.toString())
        const userId = body.meta.custom_data?.user_id // Need to ensure this is passed in checkout custom data

        return {
          processed: true,
          subscription: {
            id: `ls_${data.id}`,
            providerSubscriptionId: data.id,
            userId: userId || '', // This might be missing if not passed in custom_data
            customerId: `ls_${attrs.customer_id}`,
            status: this.mapStatus(attrs.status),
            plan,
            provider: 'lemonsqueezy',
            interval: attrs.variant_name.toLowerCase().includes('year') ? 'year' : 'month',
            amount: null,
            currency: null,
            currentPeriodStart: new Date(attrs.created_at),
            currentPeriodEnd: new Date(attrs.renews_at),
            cancelAtPeriodEnd: attrs.cancelled,
            canceledAt: attrs.ends_at ? new Date(attrs.ends_at) : null,
            trialStart: null,
            trialEnd: attrs.trial_ends_at ? new Date(attrs.trial_ends_at) : null,
          },
        }
      }

      case 'order_created': {
        const attrs = data.attributes
        return {
          processed: true,
          payment: {
            id: `ls_${data.id}`,
            providerPaymentId: data.id,
            userId: body.meta.custom_data?.user_id || '',
            customerId: `ls_${attrs.customer_id}`,
            type: 'one_time',
            status: attrs.status === 'paid' ? 'succeeded' : 'pending',
            amount: attrs.total / 100,
            currency: attrs.currency,
            description: `Order ${data.id}`,
            provider: 'lemonsqueezy',
          },
        }
      }

      default:
        return { processed: true }
    }
  }

  async validateWebhook(rawBody: string, signature: string): Promise<boolean> {
    if (!process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
      throw new Error('LEMONSQUEEZY_WEBHOOK_SECRET is required')
    }

    const hmac = crypto.createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET)
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8')
    const signatureBuffer = Buffer.from(signature, 'utf8')

    return crypto.timingSafeEqual(digest, signatureBuffer)
  }

  private mapStatus(status: string): SubscriptionData['status'] {
    switch (status) {
      case 'active':
        return 'active'
      case 'on_trial':
        return 'trialing'
      case 'past_due':
        return 'past_due'
      case 'cancelled':
        return 'canceled'
      case 'expired':
        return 'canceled'
      case 'paused':
        return 'paused'
      default:
        return 'incomplete'
    }
  }

  private mapVariantToPlan(variantId: string): PlanName {
    for (const [planName, plan] of Object.entries(paymentConfig.plans)) {
      const prices = (plan.prices as any).lemonsqueezy
      if (prices?.some((price: any) => price.productId === variantId)) {
        return planName as PlanName
      }
    }
    return 'free'
  }
}
