'use server'

import { ConvexHttpClient } from 'convex/browser'
import { auth } from '@clerk/nextjs/server'
import { api } from '@/convex/_generated/api'

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error('NEXT_PUBLIC_CONVEX_URL is required')
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)

export const getStripeConnectAccount = async () => {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Not Authenticated')
  }

  const stripeConnectId = await convex.query(
    api.users.getUsersStripeConnectId,
    { userId }
  )

  return { stripeConnectId: stripeConnectId || null }
}
