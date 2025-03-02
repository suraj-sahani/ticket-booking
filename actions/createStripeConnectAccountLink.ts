'use server'

import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'

export const createStripeConnectAccountLink = async (account: string) => {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin') || ''

    const accountLink = await stripe.accountLinks.create({
      account,
      refresh_url: `${origin}/connect/refresh/${account}`,
      return_url: `${origin}/connect/return/${account}`,
      type: 'account_onboarding',
    })

    return { url: accountLink?.url }
  } catch (error) {
    console.error('Error occured while creating account links:', error)

    if (error instanceof Error) {
      throw new Error(error.message)
    }

    throw new Error('Failed to create account link')
  }
}
