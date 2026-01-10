/**
 * Payment Configuration
 *
 * Centralized configuration for all payment plans and products.
 * This file defines the complete product catalog and pricing structure.
 */

export type PlanName = 'free' | 'starter' | 'pro' | 'enterprise'
export type PaymentProvider = 'stripe' | 'polar' | 'lemonsqueezy'
export type Interval = 'month' | 'year' | null // null for one-time payments

export interface PriceConfig {
  /** Price ID from the payment provider */
  productId: string
  /** Billing interval */
  interval: Interval
  /** Price amount (in cents for Stripe, etc.) */
  amount: number
  /** Currency code */
  currency: string
  /** Whether this price supports seat-based billing */
  seatBased?: boolean
  /** Trial period in days */
  trialPeriodDays?: number
  /** Whether this is a recurring subscription */
  type: 'recurring' | 'one_time'
}

export type PlansConfig = {
  readonly [K in PlanName]: {
    /** Plan name */
    readonly name: string
    /** Plan description */
    readonly description: string
    /** Whether this is a free plan */
    readonly isFree?: boolean
    /** Recommended plan (shows highlight) */
    readonly recommended?: boolean
    /** Pricing configurations by provider */
    readonly prices: {
      readonly [P in PaymentProvider]?: readonly PriceConfig[]
    }
    /** Feature list for display */
    readonly features: readonly string[]
    /** Maximum seats for seat-based billing */
    readonly maxSeats?: number
  }
}

export const paymentConfig = {
  /** Available plans */
  plans: {
    free: {
      name: 'Free',
      description: 'Perfect for getting started',
      isFree: true,
      prices: {}, // Free plan has no prices
      features: ['Up to 3 projects', 'Basic analytics', 'Community support', 'Standard templates'],
    },

    starter: {
      name: 'Starter',
      description: 'Great for small teams',
      prices: {
        stripe: [
          {
            productId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY || '',
            interval: 'month' as const,
            amount: 990, // $9.90
            currency: 'usd',
            seatBased: false,
            trialPeriodDays: 14,
            type: 'recurring' as const,
          },
          {
            productId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_YEARLY || '',
            interval: 'year' as const,
            amount: 9900, // $99
            currency: 'usd',
            seatBased: false,
            trialPeriodDays: 14,
            type: 'recurring' as const,
          },
        ],
        polar: [
          {
            productId: process.env.NEXT_PUBLIC_POLAR_PRODUCT_STARTER_MONTHLY || '',
            interval: 'month' as const,
            amount: 990,
            currency: 'usd',
            seatBased: false,
            trialPeriodDays: 14,
            type: 'recurring' as const,
          },
        ],
        lemonsqueezy: [
          {
            productId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_STARTER_MONTHLY || '',
            interval: 'month' as const,
            amount: 990,
            currency: 'usd',
            seatBased: false,
            trialPeriodDays: 14,
            type: 'recurring' as const,
          },
        ],
      },
      features: [
        'Up to 10 projects',
        'Advanced analytics',
        'Email support',
        'Premium templates',
        'Custom integrations',
      ],
    },

    pro: {
      name: 'Pro',
      description: 'For growing businesses',
      recommended: true,
      prices: {
        stripe: [
          {
            productId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || '',
            interval: 'month' as const,
            amount: 2990, // $29.90
            currency: 'usd',
            seatBased: true,
            trialPeriodDays: 14,
            type: 'recurring' as const,
          },
          {
            productId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY || '',
            interval: 'year' as const,
            amount: 29900, // $299
            currency: 'usd',
            seatBased: true,
            trialPeriodDays: 14,
            type: 'recurring' as const,
          },
        ],
        polar: [
          {
            productId: process.env.NEXT_PUBLIC_POLAR_PRODUCT_PRO_MONTHLY || '',
            interval: 'month' as const,
            amount: 2990,
            currency: 'usd',
            seatBased: true,
            trialPeriodDays: 14,
            type: 'recurring' as const,
          },
        ],
        lemonsqueezy: [
          {
            productId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_PRO_MONTHLY || '',
            interval: 'month' as const,
            amount: 2990,
            currency: 'usd',
            seatBased: true,
            trialPeriodDays: 14,
            type: 'recurring' as const,
          },
        ],
      },
      features: [
        'Unlimited projects',
        'Real-time analytics',
        'Priority support',
        'White-label options',
        'Advanced integrations',
        'Team collaboration',
        'Custom workflows',
      ],
      maxSeats: 50,
    },

    enterprise: {
      name: 'Enterprise',
      description: 'For large organizations',
      prices: {
        stripe: [
          {
            productId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY || '',
            interval: 'month' as const,
            amount: 9990, // $99.90
            currency: 'usd',
            seatBased: true,
            trialPeriodDays: 30,
            type: 'recurring' as const,
          },
          {
            productId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY || '',
            interval: 'year' as const,
            amount: 99900, // $999
            currency: 'usd',
            seatBased: true,
            trialPeriodDays: 30,
            type: 'recurring' as const,
          },
        ],
        polar: [
          {
            productId: process.env.NEXT_PUBLIC_POLAR_PRODUCT_ENTERPRISE_MONTHLY || '',
            interval: 'month' as const,
            amount: 9990,
            currency: 'usd',
            seatBased: true,
            trialPeriodDays: 30,
            type: 'recurring' as const,
          },
        ],
        lemonsqueezy: [
          {
            productId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_ENTERPRISE_MONTHLY || '',
            interval: 'month' as const,
            amount: 9990,
            currency: 'usd',
            seatBased: true,
            trialPeriodDays: 30,
            type: 'recurring' as const,
          },
        ],
      },
      features: [
        'Everything in Pro',
        'Dedicated account manager',
        'Custom contracts',
        'SLA guarantees',
        'Advanced security',
        'Unlimited seats',
        'Custom integrations',
        'On-premise deployment',
      ],
    },
  },

  /** Payment provider settings */
  providers: {
    /** Success and cancel URLs for checkout */
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
    cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=canceled`,

    /** Portal return URL */
    portalReturnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  },
} as const satisfies {
  plans: PlansConfig
  providers: {
    successUrl: string
    cancelUrl: string
    portalReturnUrl: string
  }
}

/** Get plan configuration by name */
export function getPlanConfig(planName: PlanName) {
  return paymentConfig.plans[planName]
}

/** Get price configuration for a specific plan and provider */
export function getPriceConfig(planName: PlanName, provider: PaymentProvider) {
  const plan = paymentConfig.plans[planName]
  return (plan.prices as any)[provider] || []
}

/** Check if a plan is free */
export function isFreePlan(planName: PlanName): boolean {
  return (paymentConfig.plans[planName] as any).isFree || false
}

/** Get all available plans */
export function getAvailablePlans(): PlanName[] {
  return Object.keys(paymentConfig.plans) as PlanName[]
}
