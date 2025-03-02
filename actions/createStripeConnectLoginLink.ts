'use server'

import { stripe } from '@/lib/stripe'

export const createStripeConnectLoginLink = async (stripeConnectId: string) => {
  if (!stripeConnectId) {
    throw new Error('Stripe connectId must be provided')
  }

  try {
    const loginLink = await stripe.accounts.createLoginLink(stripeConnectId)
    return loginLink?.url
  } catch (error) {
    console.error('Error while creating stripe connect login link:', error)
    throw new Error('Failed to create stripe connect login link.')
  }
}
