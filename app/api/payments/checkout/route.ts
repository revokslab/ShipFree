import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { z } from 'zod'

import { auth } from '@/lib/auth'
import { getPaymentAdapter } from '@/lib/payments/service'
import { getAvailablePlans } from '@/config/payments'

const checkoutSchema = z.object({
  plan: z.enum(getAvailablePlans() as [string, ...string[]]),
  successUrl: z.string().optional(),
  cancelUrl: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const result = checkoutSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { plan, successUrl, cancelUrl } = result.data
    const adapter = getPaymentAdapter()

    const checkoutSession = await adapter.createCheckout({
      plan: plan as any,
      userId: session.user.id,
      email: session.user.email,
      successUrl,
      cancelUrl,
    })

    return NextResponse.json(checkoutSession)
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}
