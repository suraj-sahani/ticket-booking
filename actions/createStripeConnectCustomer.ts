'use server'

import { ConvexHttpClient } from 'convex/browser'
import { auth } from '@clerk/nextjs/server'
import { api } from '@/convex/_generated/api'
import { stripe } from '@/lib/stripe'

if (!process.env.NEXT_PUBLIC_CONVEX_URL)
  throw new Error('NEXT_PUBLIC_CONVEX_URl is required')

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)

export async function createStripeConnectCustomer() {
  const { userId } = await auth()
  if (!userId) throw new Error('No user found for creating Stripe connect')

  // Check if user already has a stripe connect id
  const existingStripeConnectId = await convex.query(
    api.users.getUsersStripeConnectId,
    { userId }
  )

  if (existingStripeConnectId) return { account: existingStripeConnectId }

  // Create new connect account if it does not exist
  const account = await stripe.accounts.create({
    type: 'express',
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  })

  await convex.mutation(api.users.updateOrCreateUserStripeConnectId, {
    userId,
    stripeConnectId: account.id,
  })

  return { account: account.id }
}
