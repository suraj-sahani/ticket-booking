import { v } from 'convex/values'
import { mutation, query } from '@/convex/_generated/server'

export const getuserById = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_user_id', (q) => q.eq('userId', userId))
      .first()

    return user
  },
})

export const updateUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, { userId, name, email }) => {
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_user_id', (q) => q.eq('userId', userId))
      .first()

    if (existingUser) {
      //     Update the existing user.
      await ctx.db.patch(existingUser._id, {
        name,
        email,
      })
      return existingUser._id
    }

    const newUser = await ctx.db.insert('users', {
      userId,
      name,
      email,
      stripeConnectId: undefined,
    })

    return newUser
  },
})

export const getUsersStripeConnectId = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('userId'), userId))
      .filter((q) => q.neq(q.field('stripeConnectId'), undefined))
      .first()

    return user?.stripeConnectId
  },
})

export const updateOrCreateUserStripeConnectId = mutation({
  args: { userId: v.string(), stripeConnectId: v.string() },
  handler: async (ctx, { userId, stripeConnectId }) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_user_id', (q) => q.eq('userId', userId))
      .first()

    if (!user) throw new Error('User does not exist')

    await ctx.db.patch(user._id, { stripeConnectId })
  },
})
