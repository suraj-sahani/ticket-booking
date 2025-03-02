import { v } from 'convex/values'
import { query, mutation } from '@/convex/_generated/server'
import { WAITING_LIST_STATUS } from '@/convex/constants'

export const getUserTicketForEvent = query({
  args: {
    eventId: v.id('events'),
    userId: v.string(),
  },
  handler: async (ctx, { eventId, userId }) =>
    await ctx.db
      .query('tickets')
      .withIndex('by_user_event', (q) =>
        q.eq('userId', userId).eq('eventId', eventId)
      )
      .first(),
})
