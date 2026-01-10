/**
 * Environment utility functions for consistent environment detection across the application
 */
import { env, isTruthy } from './env'

/**
 * Is the application running in production mode
 */
export const isProd = env.NODE_ENV === 'production'

/**
 * Is the application running in development mode
 */
export const isDev = env.NODE_ENV === 'development'

/**
 * Is the application running in test mode
 */
export const isTest = env.NODE_ENV === 'test'

/**
 * Is billing enforcement enabled
 */
export const isBillingEnabled = isTruthy(env.BILLING_ENABLED)

/**
 * Is email verification enabled
 */
export const isEmailVerificationEnabled = isTruthy(env.EMAIL_VERIFICATION_ENABLED)

/**
 * Billing provider detection utilities
 * These check if the required credentials are configured for each provider
 * Uses better-auth payment plugins: stripe, polar, dodo, creem, autumn
 */

/** Check if Stripe is configured (@better-auth/stripe) */
export const isStripeConfigured = Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET)

/** Check if Polar is configured (@polar-sh/better-auth) */
export const isPolarConfigured = Boolean(env.POLAR_ACCESS_TOKEN)

/** Check if Dodo Payments is configured (@dodopayments/better-auth) */
export const isDodoConfigured = Boolean(env.DODO_API_KEY)

/** Check if Creem is configured (@creem_io/better-auth) */
export const isCreemConfigured = Boolean(env.CREEM_API_KEY)

/** Check if Autumn is configured (autumn-js/better-auth) */
export const isAutumnConfigured = Boolean(env.AUTUMN_API_KEY)

/** Get the explicitly selected billing provider */
export const selectedBillingProvider = env.BILLING_PROVIDER

/** Check if any billing provider is configured */
export const hasBillingProvider =
  isStripeConfigured ||
  isPolarConfigured ||
  isDodoConfigured ||
  isCreemConfigured ||
  isAutumnConfigured
