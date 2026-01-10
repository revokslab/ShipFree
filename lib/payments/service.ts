/**
 * Payment Service
 *
 * Core service for handling payment operations.
 * Routes requests to the configured payment provider adapter.
 */

import { env } from '@/config/env'
import type { PaymentProvider } from '@/config/payments'
import type { PaymentAdapter } from './types'
import { StripeAdapter } from './providers/stripe'
import { PolarAdapter } from './providers/polar'
import { LemonSqueezyAdapter } from './providers/lemonsqueezy'

// Singleton instance of the active adapter
let paymentAdapter: PaymentAdapter | null = null

/**
 * Get the active payment provider name
 */
export function getActivePaymentProvider(): PaymentProvider {
  return (env.PAYMENT_PROVIDER as PaymentProvider) || 'stripe'
}

/**
 * Get the active payment adapter
 */
export function getPaymentAdapter(): PaymentAdapter {
  if (paymentAdapter) {
    return paymentAdapter
  }

  const provider = getActivePaymentProvider()

  switch (provider) {
    case 'stripe':
      paymentAdapter = new StripeAdapter()
      break
    case 'polar':
      paymentAdapter = new PolarAdapter()
      break
    case 'lemonsqueezy':
      paymentAdapter = new LemonSqueezyAdapter()
      break
    default:
      throw new Error(`Unknown payment provider: ${provider}`)
  }

  return paymentAdapter
}

/**
 * Check if the payment system is configured
 */
export function isPaymentSystemConfigured(): boolean {
  try {
    getPaymentAdapter()
    return true
  } catch (error) {
    return false
  }
}
