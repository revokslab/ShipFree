/**
 * AgentaOS Payment Adapter
 *
 * Implements the PaymentAdapter interface for AgentaOS (https://agentaos.ai) integration.
 * AgentaOS is a Merchant of Record. Handles checkout sessions, subscriptions, and webhooks.
 *
 * Plans map to AgentaOS subscription payment links: the "product ID" configured for each
 * plan is the payment link's `id` (a UUID, "Copy link ID" in the dashboard).
 *
 * Dependency: @agentaos/pay
 */

import { AgentaOS, WebhookVerificationError } from '@agentaos/pay'
import type { Subscription as AgentaOSSubscription } from '@agentaos/pay'
import type {
  PaymentAdapter,
  CheckoutOptions,
  CheckoutResult,
  CustomerData,
  SubscriptionData,
  PaymentData,
  PortalResult,
  WebhookEvent,
  WebhookResult,
} from '../types'
import type { PaymentProvider, PlanName, PriceConfig } from '@/config/payments'
import { getPriceConfig, paymentConfig } from '@/config/payments'
import { env } from '@/config/env'

/** Page size for subscriptions.list(); the API caps it at 100. */
const SUBSCRIPTION_PAGE_SIZE = 100

/**
 * A subscription as it arrives in a webhook (`subscription.*` events) or from
 * `subscriptions.list()`, after camelCasing. The list response uses
 * `unitAmountMinor` and `billingInterval`; webhook payloads use `amountMinor`.
 */
interface AgentaOSSubscriptionLike {
  id: string
  status: string
  linkId?: string | null
  currency?: string | null
  amountMinor?: number | null
  unitAmountMinor?: number | null
  billingInterval?: 'month' | 'year' | null
  currentPeriodEnd?: string | null
  cancelAtPeriodEnd?: boolean
  canceledAt?: string | null
}

/**
 * `checkout.session.completed` data, camelCased. Includes the fields the SDK's
 * `CheckoutCompletedData` type does not declare yet (customerId, buyerEmail, trial, trialEnd).
 */
interface AgentaOSCheckoutCompleted {
  sessionId: string
  amount: string
  currency: string
  customerId?: string | null
  buyerEmail?: string | null
  trial?: boolean
  trialEnd?: string | null
  metadata?: Record<string, unknown> | null
}

function toCamelCase(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_, char: string) => char.toUpperCase())
}

/**
 * The webhook route hands adapters the raw (snake_case) JSON body. The AgentaOS SDK's
 * `webhooks.verify()` returns events with every key camelCased, metadata included, so
 * normalize the raw body to the same shape before reading it.
 */
function camelizeKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(camelizeKeys)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nested]) => [
        toCamelCase(key),
        camelizeKeys(nested),
      ])
    )
  }
  return value
}

function toDate(value: unknown): Date | null {
  if (!value) return null
  const date = new Date(value as string)
  return Number.isNaN(date.getTime()) ? null : date
}

function readString(record: Record<string, unknown> | null | undefined, key: string): string {
  const value = record?.[key]
  return typeof value === 'string' ? value : ''
}

export class AgentaOSAdapter implements PaymentAdapter {
  public readonly provider: PaymentProvider = 'agentaos'
  private agentaos: AgentaOS

  constructor() {
    if (!env.AGENTAOS_API_KEY) {
      throw new Error('AGENTAOS_API_KEY is required for AgentaOS adapter')
    }

    // The key prefix selects the mode: sk_test_ for test mode, sk_live_ for live.
    this.agentaos = new AgentaOS(env.AGENTAOS_API_KEY)
  }

  async createCheckout(options: CheckoutOptions): Promise<CheckoutResult> {
    const { plan, successUrl, cancelUrl, userId, email } = options

    const prices: PriceConfig[] = getPriceConfig(plan, 'agentaos')
    if (prices.length === 0) {
      throw new Error(`No AgentaOS prices configured for plan: ${plan}`)
    }

    // Use the monthly price if present, otherwise the first configured price.
    const price = prices.find((p) => p.interval === 'month') || prices[0]

    if (!price.productId) {
      throw new Error(`No AgentaOS payment link ID configured for plan ${plan}`)
    }

    try {
      // Trials are a property of the payment link (trialPeriodDays), not of the checkout.
      const checkout = await this.agentaos.checkouts.create({
        linkId: price.productId,
        successUrl: successUrl || paymentConfig.providers.successUrl,
        cancelUrl: cancelUrl || paymentConfig.providers.cancelUrl,
        ...(email && { buyerEmail: email }),
        metadata: {
          userId,
          plan,
          provider: 'agentaos',
        },
      })

      if (!checkout.checkoutUrl) {
        throw new Error('AgentaOS checkout did not return a checkout URL')
      }

      return {
        url: checkout.checkoutUrl,
        sessionId: checkout.sessionId,
      }
    } catch (error) {
      console.error('AgentaOS checkout creation error:', error)
      throw new Error('Failed to create AgentaOS checkout session')
    }
  }

  async createCustomer(userId: string, email?: string): Promise<CustomerData> {
    // AgentaOS creates the customer when the buyer pays a checkout.
    // Return a placeholder that the checkout webhook reconciles with the real id.
    const customerId = `agentaos_pending_${userId}`

    return {
      id: customerId,
      providerCustomerId: customerId,
      email,
      userId,
      provider: 'agentaos',
    }
  }

  async getSubscription(providerSubscriptionId: string): Promise<SubscriptionData | null> {
    try {
      const subscription = await this.findSubscription(providerSubscriptionId)
      return subscription ? this.mapSubscription(subscription) : null
    } catch (error) {
      console.error('Failed to get AgentaOS subscription:', error)
      return null
    }
  }

  async cancelSubscription(
    providerSubscriptionId: string,
    cancelAtPeriodEnd = true
  ): Promise<void> {
    try {
      await this.agentaos.subscriptions.cancel(providerSubscriptionId, {
        atPeriodEnd: cancelAtPeriodEnd,
      })
    } catch (error) {
      console.error('AgentaOS subscription cancellation error:', error)
      throw new Error('Failed to cancel AgentaOS subscription')
    }
  }

  async createPortal(_customerId: string, _returnUrl?: string): Promise<PortalResult> {
    // AgentaOS has no hosted customer portal. Manage subscriptions from your app
    // with getSubscription / cancelSubscription instead.
    throw new Error(
      'AgentaOS does not provide a hosted customer portal. Use cancelSubscription to manage subscriptions.'
    )
  }

  async processWebhook(event: WebhookEvent): Promise<WebhookResult> {
    try {
      const agentaosEvent = camelizeKeys(event.rawEvent) as {
        type?: string
        data?: Record<string, unknown>
      }
      const data = agentaosEvent.data || {}

      switch (agentaosEvent.type) {
        case 'checkout.session.completed':
          return this.handleCheckoutCompleted(data as unknown as AgentaOSCheckoutCompleted)

        case 'subscription.created':
        case 'subscription.renewed':
        case 'subscription.payment_failed':
        case 'subscription.updated':
        case 'subscription.canceled':
          // Subscription events carry no merchant metadata, so they update the row
          // created from the first checkout.session.completed (matched by subscription id).
          return {
            processed: true,
            subscription: this.mapSubscription(data as unknown as AgentaOSSubscriptionLike),
          }

        default:
          return { processed: true }
      }
    } catch (error) {
      console.error('AgentaOS webhook processing error:', error)
      return {
        processed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async validateWebhook(rawBody: string, signature: string): Promise<boolean> {
    if (!env.AGENTAOS_WEBHOOK_SECRET) {
      throw new Error('AGENTAOS_WEBHOOK_SECRET is required for webhook validation')
    }

    try {
      // HMAC-SHA256 over `${t}.${rawBody}`, timing-safe, with a 5 minute replay window.
      this.agentaos.webhooks.verify(rawBody, signature, env.AGENTAOS_WEBHOOK_SECRET)
      return true
    } catch (error) {
      if (error instanceof WebhookVerificationError) {
        return false
      }
      throw error
    }
  }

  /**
   * `checkout.session.completed` fires for one-time sales, for the first payment (or trial
   * start) of a subscription, and for every renewal. Only the first checkout carries our
   * own metadata (userId, plan); renewals carry AgentaOS metadata with `subscriptionId`
   * and no userId, so the webhook handler does not insert them as new rows.
   */
  private async handleCheckoutCompleted(data: AgentaOSCheckoutCompleted): Promise<WebhookResult> {
    const metadata = data.metadata || {}
    const userId = readString(metadata, 'userId')
    const plan = readString(metadata, 'plan') as PlanName
    const subscriptionId = readString(metadata, 'subscriptionId')

    const customer: CustomerData | undefined =
      userId && data.customerId
        ? {
            id: `agentaos_${data.customerId}`,
            providerCustomerId: data.customerId,
            email: data.buyerEmail || undefined,
            userId,
            provider: 'agentaos',
          }
        : undefined

    // Only the first checkout creates the subscription row. Renewals update it through
    // the subscription.renewed event, which carries the new period end.
    const subscription =
      subscriptionId && userId
        ? await this.resolveCheckoutSubscription(subscriptionId, data, userId, plan, customer)
        : undefined

    const amount = Number.parseFloat(data.amount) || 0

    // A free trial start (or a renewal paid fully by credit) has amount "0": no money received.
    const payment: PaymentData | undefined =
      amount > 0
        ? {
            id: `agentaos_${data.sessionId}`,
            providerPaymentId: data.sessionId,
            userId,
            customerId: customer?.id,
            subscriptionId: subscription?.id,
            type: subscriptionId ? 'subscription' : 'one_time',
            status: 'succeeded',
            amount,
            currency: data.currency.toLowerCase(),
            description: `AgentaOS checkout ${data.sessionId}`,
            provider: 'agentaos',
          }
        : undefined

    return { processed: true, customer, subscription, payment }
  }

  /**
   * Read the full subscription from the API; fall back to what the checkout event and the
   * plan config tell us if it is not listed yet.
   */
  private async resolveCheckoutSubscription(
    subscriptionId: string,
    data: AgentaOSCheckoutCompleted,
    userId: string,
    plan: PlanName,
    customer: CustomerData | undefined
  ): Promise<SubscriptionData> {
    const listed = await this.findSubscription(subscriptionId).catch(() => undefined)

    const subscription = listed
      ? this.mapSubscription(listed, userId)
      : this.mapCheckoutToSubscription(subscriptionId, data, userId, plan)

    if (data.trial) {
      subscription.trialEnd = toDate(data.trialEnd) || subscription.trialEnd
    }

    return { ...subscription, customerId: customer?.id }
  }

  private mapCheckoutToSubscription(
    subscriptionId: string,
    data: AgentaOSCheckoutCompleted,
    userId: string,
    plan: PlanName
  ): SubscriptionData {
    const price = this.findPrice(plan)

    return {
      id: `agentaos_${subscriptionId}`,
      providerSubscriptionId: subscriptionId,
      userId,
      status: data.trial ? 'trialing' : 'active',
      plan: plan || 'free',
      provider: 'agentaos',
      interval: price?.interval ?? 'month',
      amount: price ? price.amount / 100 : null,
      currency: price?.currency ?? data.currency.toLowerCase(),
      currentPeriodStart: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      canceledAt: null,
      trialStart: null,
      trialEnd: null,
    }
  }

  /**
   * AgentaOS has no retrieve-by-id for subscriptions; page through list() to find one.
   */
  private async findSubscription(
    subscriptionId: string
  ): Promise<AgentaOSSubscription | undefined> {
    for (let offset = 0; ; offset += SUBSCRIPTION_PAGE_SIZE) {
      const page = await this.agentaos.subscriptions.list({
        limit: SUBSCRIPTION_PAGE_SIZE,
        offset,
      })
      const found = page.items.find((s) => s.id === subscriptionId)
      if (found || !page.hasMore) return found
    }
  }

  /**
   * Normalize an AgentaOS subscription (from the API or a webhook payload) into the
   * unified SubscriptionData shape.
   */
  private mapSubscription(sub: AgentaOSSubscriptionLike, userId = ''): SubscriptionData {
    const { plan, price } = this.mapLinkToPlan(sub.linkId || '')
    const amountMinor = sub.unitAmountMinor ?? sub.amountMinor
    const status = this.mapStatus(sub.status)
    const currentPeriodEnd = toDate(sub.currentPeriodEnd)

    return {
      id: `agentaos_${sub.id}`,
      providerSubscriptionId: sub.id,
      userId,
      status,
      plan,
      provider: 'agentaos',
      interval: sub.billingInterval ?? price?.interval ?? 'month',
      amount: typeof amountMinor === 'number' ? amountMinor / 100 : null,
      currency: sub.currency ? sub.currency.toLowerCase() : null,
      currentPeriodStart: null,
      currentPeriodEnd,
      cancelAtPeriodEnd: Boolean(sub.cancelAtPeriodEnd),
      canceledAt: toDate(sub.canceledAt),
      trialStart: null,
      // While trialing, currentPeriodEnd is the trial end.
      trialEnd: status === 'trialing' ? currentPeriodEnd : null,
    }
  }

  private mapStatus(status: string): SubscriptionData['status'] {
    switch (status) {
      case 'active':
        return 'active'
      case 'trialing':
        return 'trialing'
      case 'paused':
        return 'paused'
      case 'canceled':
      case 'incomplete_expired':
        return 'canceled'
      case 'past_due':
      case 'unpaid':
        return 'past_due'
      default:
        return 'incomplete'
    }
  }

  private findPrice(plan: PlanName): PriceConfig | undefined {
    if (!plan) return undefined
    const prices: PriceConfig[] = getPriceConfig(plan, 'agentaos')
    return prices[0]
  }

  private mapLinkToPlan(linkId: string): { plan: PlanName; price?: PriceConfig } {
    for (const [planName, plan] of Object.entries(paymentConfig.plans)) {
      const agentaosPrices: readonly PriceConfig[] | undefined = (
        plan.prices as { agentaos?: readonly PriceConfig[] }
      ).agentaos
      const price = agentaosPrices?.find((p) => p.productId === linkId)
      if (linkId && price) {
        return { plan: planName as PlanName, price }
      }
    }

    return { plan: 'free' }
  }
}
