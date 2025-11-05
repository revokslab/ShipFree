import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const stripe = new Stripe(config.stripeSecretKey as string)

  const body = await readRawBody(event)
  const sig = getHeader(event, 'stripe-signature') as string

  let stripeEvent

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      body as string,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    throw createError({
      statusCode: 400,
      statusMessage: `Webhook Error: ${err.message}`,
    })
  }

  switch (stripeEvent.type) {
    case 'customer.subscription.created':
      // Handle subscription created
      break
    case 'customer.subscription.updated':
      // Handle subscription updated
      break
    case 'customer.subscription.deleted':
      // Handle subscription cancelled
      break
    default:
      console.log(`Unhandled event type ${stripeEvent.type}`)
  }

  return { received: true }
})
