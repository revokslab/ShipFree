import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { auth } from '@/lib/auth'
import { getPaymentAdapter } from '@/lib/payments/service'
import { db } from '@/database'
import { customer } from '@/database/schema'

const portalSchema = z.object({
  returnUrl: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const result = portalSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { returnUrl } = result.data
    const adapter = getPaymentAdapter()

    // Find customer for this user
    const userCustomer = await db.query.customer.findFirst({
      where: eq(customer.userId, session.user.id),
    })

    if (!userCustomer) {
      return NextResponse.json({ error: 'No customer found' }, { status: 404 })
    }

    // Ensure customer matches active provider
    if (userCustomer.provider !== adapter.provider) {
      return NextResponse.json(
        {
          error: `Customer provider (${userCustomer.provider}) does not match active provider (${adapter.provider})`,
        },
        { status: 400 }
      )
    }

    const portalSession = await adapter.createPortal(userCustomer.providerCustomerId, returnUrl)

    return NextResponse.json(portalSession)
  } catch (error) {
    console.error('Portal error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}
