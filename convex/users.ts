import { v } from 'convex/values'
import { mutation, query } from '@/convex/_generated/server'

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
