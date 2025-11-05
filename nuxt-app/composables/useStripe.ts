import { loadStripe, type Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

export const useStripe = () => {
  const config = useRuntimeConfig()

  const getStripe = () => {
    if (!stripePromise) {
      stripePromise = loadStripe(config.public.stripePublishableKey as string)
    }
    return stripePromise
  }

  return {
    getStripe
  }
}
