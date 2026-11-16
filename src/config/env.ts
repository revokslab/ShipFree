import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

/**
 * Coerce a boolean-ish env var into a real boolean.
 *
 * Environment variables are always strings, so `z.boolean()` rejects "true"/"false"
 * and crashes the app at startup. This parses the string and normalizes the result,
 * mirroring the semantics of `isTruthy` below.
 */
const booleanFlag = (defaultValue: 'true' | 'false') =>
  z
    .string()
    .default(defaultValue)
    .transform((value) => value.toLowerCase() === 'true' || value === '1')

export const env = createEnv({
  server: {
    // Core Database and Authentication
    DATABASE_URL: z.string().optional(),
    BETTER_AUTH_SECRET: z.string().default('dev-secret-change-in-production'),
    BETTER_AUTH_URL: z.string().default('http://localhost:3000'),
    BILLING_ENABLED: booleanFlag('false'),
    EMAIL_VERIFICATION_ENABLED: booleanFlag('false'),

    // Optional: Sentry
    SENTRY_DSN: z.string().optional(),

    // Optional: Cloudflare R2
    CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
    R2_ACCESS_KEY_ID: z.string().optional(),
    R2_SECRET_ACCESS_KEY: z.string().optional(),
    R2_BUCKET_URL: z.string().optional(),
    R2_STORAGE_BASE_URL: z.string().optional(),
    R2_PUBLIC_BUCKET: z.string().optional(),
    R2_PRIVATE_BUCKET: z.string().optional(),

    // Optional: Email providers
    EMAIL_PROVIDER: z
      .enum(['resend', 'postmark', 'nodemailer', 'plunk', 'custom', 'log'])
      .default('log'),
    RESEND_API_KEY: z.string().optional(),
    RESEND_DOMAIN: z.string().optional(),
    POSTMARK_API_TOKEN: z.string().optional(),
    PLUNK_API_KEY: z.string().optional(),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    SMTP_SECURE: z.string().optional(),
    DEFAULT_FROM_EMAIL: z.string().optional(),
    DEFAULT_FROM_NAME: z.string().optional(),

    // Optional: Payment provider selection
    PAYMENT_PROVIDER: z.enum(['stripe', 'polar', 'lemonsqueezy', 'creem']).default('stripe'),

    // Stripe
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    STRIPE_PRICE_ID: z.string().optional(),

    // Polar
    POLAR_ACCESS_TOKEN: z.string().optional(),
    POLAR_WEBHOOK_SECRET: z.string().optional(),
    POLAR_ORGANIZATION_ID: z.string().optional(),
    POLAR_PRODUCT_ID: z.string().optional(),
    POLAR_ENVIRONMENT: z.enum(['production', 'sandbox']).default('production'),

    // Lemon Squeezy
    LEMONSQUEEZY_API_KEY: z.string().optional(),
    LEMONSQUEEZY_STORE_ID: z.string().optional(),
    LEMONSQUEEZY_WEBHOOK_SECRET: z.string().optional(),

    // Creem (https://creem.io) - EU-based Merchant of Record
    CREEM_API_KEY: z.string().optional(),
    CREEM_WEBHOOK_SECRET: z.string().optional(),
    // Creem ships separate test/production API keys; set this to use test-api.creem.io
    CREEM_TEST_MODE: z.string().optional(),

    // Optional: OAuth
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    MICROSOFT_CLIENT_ID: z.string().optional(),
    MICROSOFT_CLIENT_SECRET: z.string().optional(),
    MICROSOFT_TENANT_ID: z.string().optional(),
    FACEBOOK_CLIENT_ID: z.string().optional(),
    FACEBOOK_CLIENT_SECRET: z.string().optional(),

    // Premium Template Purchase (completely separate from template's payment system)
    // Can be removed if not needed - see README for removal instructions
    PREMIUM_PURCHASE_STRIPE_SECRET_KEY: z.string().optional(),
    PREMIUM_PURCHASE_STRIPE_PRICE_ID: z.string().optional(),
    PREMIUM_PURCHASE_STRIPE_WEBHOOK_SECRET: z.string().optional(),
  },

  client: {
    NEXT_PUBLIC_APP_URL: z.string().default('http://localhost:3000'),
    // Lemon Squeezy product IDs (public)
    NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_STARTER_MONTHLY: z.string().optional(),
    NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_PRO_MONTHLY: z.string().optional(),
    NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_ENTERPRISE_MONTHLY: z.string().optional(),

    // Stripe price IDs (public)
    NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PRICE_STARTER_YEARLY: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY: z.string().optional(),

    // Polar product IDs (public)
    NEXT_PUBLIC_POLAR_PRODUCT_STARTER_MONTHLY: z.string().optional(),
    NEXT_PUBLIC_POLAR_PRODUCT_PRO_MONTHLY: z.string().optional(),
    NEXT_PUBLIC_POLAR_PRODUCT_ENTERPRISE_MONTHLY: z.string().optional(),

    // Creem product IDs (public)
    NEXT_PUBLIC_CREEM_PRODUCT_STARTER_MONTHLY: z.string().optional(),
    NEXT_PUBLIC_CREEM_PRODUCT_PRO_MONTHLY: z.string().optional(),
    NEXT_PUBLIC_CREEM_PRODUCT_ENTERPRISE_MONTHLY: z.string().optional(),

    // Premium Template Purchase (public)
    NEXT_PUBLIC_PREMIUM_PURCHASE_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
    NEXT_PUBLIC_PREMIUM_PURCHASE_DISCORD_INVITE_LINK: z.string().optional(),
  },

  // Variables available on both server and client
  shared: {
    NODE_ENV: z.enum(['development', 'test', 'production']).optional(), // Runtime environment
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    BILLING_ENABLED: process.env.BILLING_ENABLED,
    EMAIL_VERIFICATION_ENABLED: process.env.EMAIL_VERIFICATION_ENABLED,
    SENTRY_DSN: process.env.SENTRY_DSN,
    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET_URL: process.env.R2_BUCKET_URL,
    R2_STORAGE_BASE_URL: process.env.R2_STORAGE_BASE_URL,
    R2_PUBLIC_BUCKET: process.env.R2_PUBLIC_BUCKET,
    R2_PRIVATE_BUCKET: process.env.R2_PRIVATE_BUCKET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_DOMAIN: process.env.RESEND_DOMAIN,
    EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
    POSTMARK_API_TOKEN: process.env.POSTMARK_API_TOKEN,
    PLUNK_API_KEY: process.env.PLUNK_API_KEY,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_SECURE: process.env.SMTP_SECURE,
    DEFAULT_FROM_EMAIL: process.env.DEFAULT_FROM_EMAIL,
    DEFAULT_FROM_NAME: process.env.DEFAULT_FROM_NAME,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    MICROSOFT_CLIENT_ID: process.env.MICROSOFT_CLIENT_ID,
    MICROSOFT_CLIENT_SECRET: process.env.MICROSOFT_CLIENT_SECRET,
    MICROSOFT_TENANT_ID: process.env.MICROSOFT_TENANT_ID,
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
    PREMIUM_PURCHASE_STRIPE_SECRET_KEY: process.env.PREMIUM_PURCHASE_STRIPE_SECRET_KEY,
    PREMIUM_PURCHASE_STRIPE_PRICE_ID: process.env.PREMIUM_PURCHASE_STRIPE_PRICE_ID,
    PREMIUM_PURCHASE_STRIPE_WEBHOOK_SECRET: process.env.PREMIUM_PURCHASE_STRIPE_WEBHOOK_SECRET,
    PAYMENT_PROVIDER: process.env.PAYMENT_PROVIDER,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PRICE_ID: process.env.STRIPE_PRICE_ID,
    POLAR_ACCESS_TOKEN: process.env.POLAR_ACCESS_TOKEN,
    POLAR_WEBHOOK_SECRET: process.env.POLAR_WEBHOOK_SECRET,
    POLAR_ORGANIZATION_ID: process.env.POLAR_ORGANIZATION_ID,
    POLAR_PRODUCT_ID: process.env.POLAR_PRODUCT_ID,
    POLAR_ENVIRONMENT: process.env.POLAR_ENVIRONMENT,
    LEMONSQUEEZY_API_KEY: process.env.LEMONSQUEEZY_API_KEY,
    LEMONSQUEEZY_STORE_ID: process.env.LEMONSQUEEZY_STORE_ID,
    LEMONSQUEEZY_WEBHOOK_SECRET: process.env.LEMONSQUEEZY_WEBHOOK_SECRET,
    CREEM_API_KEY: process.env.CREEM_API_KEY,
    CREEM_WEBHOOK_SECRET: process.env.CREEM_WEBHOOK_SECRET,
    CREEM_TEST_MODE: process.env.CREEM_TEST_MODE,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_STARTER_MONTHLY:
      process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_STARTER_MONTHLY,
    NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_PRO_MONTHLY:
      process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_PRO_MONTHLY,
    NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_ENTERPRISE_MONTHLY:
      process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_ENTERPRISE_MONTHLY,
    NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY,
    NEXT_PUBLIC_STRIPE_PRICE_STARTER_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_YEARLY,
    NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY,
    NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY,
    NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY,
    NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY,
    NEXT_PUBLIC_POLAR_PRODUCT_STARTER_MONTHLY:
      process.env.NEXT_PUBLIC_POLAR_PRODUCT_STARTER_MONTHLY,
    NEXT_PUBLIC_POLAR_PRODUCT_PRO_MONTHLY: process.env.NEXT_PUBLIC_POLAR_PRODUCT_PRO_MONTHLY,
    NEXT_PUBLIC_POLAR_PRODUCT_ENTERPRISE_MONTHLY:
      process.env.NEXT_PUBLIC_POLAR_PRODUCT_ENTERPRISE_MONTHLY,
    NEXT_PUBLIC_CREEM_PRODUCT_STARTER_MONTHLY:
      process.env.NEXT_PUBLIC_CREEM_PRODUCT_STARTER_MONTHLY,
    NEXT_PUBLIC_CREEM_PRODUCT_PRO_MONTHLY: process.env.NEXT_PUBLIC_CREEM_PRODUCT_PRO_MONTHLY,
    NEXT_PUBLIC_CREEM_PRODUCT_ENTERPRISE_MONTHLY:
      process.env.NEXT_PUBLIC_CREEM_PRODUCT_ENTERPRISE_MONTHLY,
    NEXT_PUBLIC_PREMIUM_PURCHASE_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_PREMIUM_PURCHASE_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_PREMIUM_PURCHASE_DISCORD_INVITE_LINK:
      process.env.NEXT_PUBLIC_PREMIUM_PURCHASE_DISCORD_INVITE_LINK,
  },
  emptyStringAsUndefined: true,
})

// Need this utility because t3-env is returning string for boolean values.
export const isTruthy = (value: string | boolean | number | undefined) =>
  typeof value === 'string' ? value.toLowerCase() === 'true' || value === '1' : Boolean(value)

// Utility to check if a value is explicitly false (defaults to false only if explicitly set)
export const isFalsy = (value: string | boolean | number | undefined) =>
  typeof value === 'string' ? value.toLowerCase() === 'false' || value === '0' : value === false
