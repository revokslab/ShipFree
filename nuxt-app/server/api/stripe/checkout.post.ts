import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const stripe = new Stripe(config.stripeSecretKey as string)

  const { priceId } = await readBody(event)
  const origin = getHeader(event, 'origin')

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
    })

    return { sessionId: session.id }
  } catch (err: any) {
    console.error('Error creating checkout session:', err)
    throw createError({
      statusCode: 500,
      statusMessage: err.message,
    })
  }
})
