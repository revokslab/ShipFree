import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { eq } from 'drizzle-orm'

import { auth } from '@/lib/auth'
import { db } from '@/database'
import { subscription } from '@/database/schema'

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userSubscription = await db.query.subscription.findFirst({
      where: eq(subscription.userId, session.user.id),
      orderBy: (subscriptions, { desc }) => [desc(subscriptions.updatedAt)],
    })

    return NextResponse.json({ subscription: userSubscription || null })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}
