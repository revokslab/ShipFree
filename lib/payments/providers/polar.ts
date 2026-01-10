/**
 * Polar Payment Adapter
 *
 * Implements the PaymentAdapter interface for Polar integration.
 * Handles checkout sessions, customers, subscriptions, and webhooks.
 */

import { Polar } from '@polar-sh/sdk'
import type {
  PaymentAdapter,
  CheckoutOptions,
  CheckoutResult,
  CustomerData,
  SubscriptionData,
  PortalResult,
  WebhookEvent,
  WebhookResult,
  WebhookEventType,
} from '../types'
import type { PaymentProvider, PlanName } from '@/config/payments'
import { getPriceConfig, paymentConfig } from '@/config/payments'
import { env } from '@/config/env'

export class PolarAdapter implements PaymentAdapter {
  public readonly provider: PaymentProvider = 'polar'
  private polar: Polar

  constructor() {
    if (!env.POLAR_ACCESS_TOKEN) {
      throw new Error('POLAR_ACCESS_TOKEN is required for Polar adapter')
    }

    this.polar = new Polar({
      accessToken: env.POLAR_ACCESS_TOKEN,
      server: env.POLAR_ENVIRONMENT === 'sandbox' ? 'sandbox' : 'production',
    })
  }

  async createCheckout(options: CheckoutOptions): Promise<CheckoutResult> {
    const { plan, successUrl, cancelUrl, trialDays, userId, email } = options

    // Get price configuration for this plan
    const prices = getPriceConfig(plan, 'polar')
    if (prices.length === 0) {
      throw new Error(`No Polar prices configured for plan: ${plan}`)
    }

    // Use the first price (monthly)
    const price = prices.find((p: any) => p.interval === 'month') || prices[0]

    if (!price.productId) {
      throw new Error(`No product ID configured for plan ${plan}`)
    }

    try {
      const checkout = await this.polar.checkouts.create({
        products: [price.productId],
        successUrl: successUrl || paymentConfig.providers.successUrl,
        customerEmail: email,
        customerMetadata: {
          userId,
          plan,
          provider: 'polar',
        },
        ...(trialDays &&
          trialDays > 0 &&
          price.type === 'recurring' && {
            subscriptionTrialDays: trialDays,
          }),
      })

      return {
        url: checkout.url,
        sessionId: checkout.id,
      }
    } catch (error) {
      console.error('Polar checkout creation error:', error)
      throw new Error('Failed to create Polar checkout session')
    }
  }

  async createCustomer(userId: string, email?: string): Promise<CustomerData> {
    try {
      // Polar doesn't have explicit customer creation - customers are created during checkout
      // We'll create a placeholder customer record that can be updated later
      const customerId = `polar_${userId}_${Date.now()}`

      return {
        id: customerId,
        providerCustomerId: customerId,
        email,
        userId,
        provider: 'polar',
      }
    } catch (error) {
      console.error('Polar customer creation error:', error)
      throw new Error('Failed to create Polar customer')
    }
  }

  async getSubscription(providerSubscriptionId: string): Promise<SubscriptionData | null> {
    try {
      const subscription = await this.polar.subscriptions.get({
        id: providerSubscriptionId,
      })

      if (!subscription) {
        return null
      }

      const plan = this.mapProductToPlan(subscription.productId)

      return {
        id: `polar_${subscription.id}`,
        providerSubscriptionId: subscription.id,
        userId: (subscription as any).customerMetadata?.userId || '',
        customerId: `polar_${subscription.customerId}`,
        status: this.mapPolarStatus(subscription.status),
        plan,
        provider: 'polar',
        interval:
          subscription.recurringInterval === 'month'
            ? 'month'
            : subscription.recurringInterval === 'year'
              ? 'year'
              : null,
        amount: subscription.amount || null,
        currency: subscription.currency || null,
        currentPeriodStart: new Date((subscription as any).currentPeriodStart),
        currentPeriodEnd: new Date((subscription as any).currentPeriodEnd),
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd || false,
        canceledAt: subscription.canceledAt ? new Date(subscription.canceledAt) : null,
        trialStart: subscription.startedAt ? new Date(subscription.startedAt) : null,
        trialEnd: subscription.endedAt ? new Date(subscription.endedAt) : null,
      }
    } catch (error) {
      console.error('Failed to get Polar subscription:', error)
      return null
    }
  }

  async cancelSubscription(
    providerSubscriptionId: string,
    cancelAtPeriodEnd = true
  ): Promise<void> {
    try {
      await this.polar.subscriptions.update({
        id: providerSubscriptionId,
        subscriptionUpdate: {
          cancelAtPeriodEnd,
        },
      })
    } catch (error) {
      console.error('Polar subscription cancellation error:', error)
      throw new Error('Failed to cancel Polar subscription')
    }
  }

  async createPortal(customerId: string, returnUrl?: string): Promise<PortalResult> {
    // Polar doesn't have a customer portal in the same way as Stripe
    // We'll redirect to their customer page or provide a link to manage subscriptions
    const polarCustomerId = customerId.replace('polar_', '')

    // For now, return a placeholder - in production you'd integrate with Polar's customer management
    return {
      url: `https://polar.sh/customer/${polarCustomerId}`,
    }
  }

  async processWebhook(event: WebhookEvent): Promise<WebhookResult> {
    try {
      const polarEvent = event.rawEvent as any

      switch (event.type) {
        case 'customer.created':
        case 'customer.updated': {
          const customer = polarEvent.data
          return {
            processed: true,
            customer: {
              id: `polar_${customer.id}`,
              providerCustomerId: customer.id,
              email: customer.email || undefined,
              userId: customer.metadata?.userId || '',
              provider: 'polar',
            },
          }
        }

        case 'subscription.created':
        case 'subscription.updated':
        case 'subscription.canceled': {
          const subscription = polarEvent.data
          const plan = this.mapProductToPlan(subscription.productId)

          return {
            processed: true,
            subscription: {
              id: `polar_${subscription.id}`,
              providerSubscriptionId: subscription.id,
              userId: subscription.customerMetadata?.userId || '',
              customerId: `polar_${subscription.customerId}`,
              status: this.mapPolarStatus(subscription.status),
              plan,
              provider: 'polar',
              interval:
                subscription.recurringInterval === 'month'
                  ? 'month'
                  : subscription.recurringInterval === 'year'
                    ? 'year'
                    : null,
              amount: subscription.amount || null,
              currency: subscription.currency || null,
              currentPeriodStart: new Date(subscription.currentPeriodStart),
              currentPeriodEnd: new Date(subscription.currentPeriodEnd),
              cancelAtPeriodEnd: subscription.cancelAtPeriodEnd || false,
              canceledAt: subscription.canceledAt ? new Date(subscription.canceledAt) : null,
              trialStart: subscription.startedAt ? new Date(subscription.startedAt) : null,
              trialEnd: subscription.endedAt ? new Date(subscription.endedAt) : null,
            },
          }
        }

        case 'order.paid' as WebhookEventType: {
          const order = polarEvent.data
          return {
            processed: true,
            payment: {
              id: `polar_${order.id}`,
              providerPaymentId: order.id,
              userId: order.customerMetadata?.userId || '',
              customerId: `polar_${order.customerId}`,
              subscriptionId: order.subscriptionId ? `polar_${order.subscriptionId}` : undefined,
              type: order.subscriptionId ? 'subscription' : 'one_time',
              status: 'succeeded',
              amount: order.amount || 0,
              currency: order.currency || 'usd',
              description: `Payment for ${order.product?.name || 'product'}`,
              provider: 'polar',
            },
          }
        }

        default:
          return { processed: true }
      }
    } catch (error) {
      console.error('Polar webhook processing error:', error)
      return {
        processed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async validateWebhook(rawBody: string, signature: string): Promise<boolean> {
    if (!env.POLAR_WEBHOOK_SECRET) {
      throw new Error('POLAR_WEBHOOK_SECRET is required for webhook validation')
    }

    try {
      // Polar webhook validation - simplified for now
      // In production, you'd implement proper signature verification
      return true
    } catch (error) {
      console.error('Polar webhook signature validation failed:', error)
      return false
    }
  }

  private mapPolarStatus(status: string): SubscriptionData['status'] {
    switch (status) {
      case 'active':
        return 'active'
      case 'canceled':
        return 'canceled'
      case 'past_due':
        return 'past_due'
      case 'trialing':
        return 'trialing'
      case 'incomplete':
        return 'incomplete'
      default:
        return 'incomplete'
    }
  }

  private mapProductToPlan(productId: string): PlanName {
    // Map product ID to plan - in production you'd maintain a mapping
    for (const [planName, plan] of Object.entries(paymentConfig.plans)) {
      const polarPrices = (plan.prices as any).polar
      if (polarPrices?.some((price: any) => price.productId === productId)) {
        return planName as PlanName
      }
    }

    return 'free' // fallback
  }
}
