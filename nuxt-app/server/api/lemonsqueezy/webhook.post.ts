import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readRawBody(event)
  const signature = getHeader(event, 'x-signature') as string

  // Verify webhook signature
  const secret = config.lemonSqueezyApiKey
  const hmac = crypto.createHmac('sha256', secret as string)
  const digest = hmac.update(body as string).digest('hex')

  if (digest !== signature) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid signature',
    })
  }

  const payload = JSON.parse(body as string)

  // Handle different event types
  switch (payload.meta.event_name) {
    case 'order_created':
      // Handle order created
      console.log('Order created:', payload.data)
      break
    case 'subscription_created':
      // Handle subscription created
      console.log('Subscription created:', payload.data)
      break
    case 'subscription_updated':
      // Handle subscription updated
      console.log('Subscription updated:', payload.data)
      break
    default:
      console.log(`Unhandled event: ${payload.meta.event_name}`)
  }

  return { received: true }
})
