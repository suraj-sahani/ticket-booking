'use client'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useState } from 'react'
import { useMutation } from 'convex/react'
import { XCircle } from 'lucide-react'

type ReleaseTicketProps = {
  eventId: Id<'events'>
  waitingListId: Id<'waitingList'>
}
const ReleaseTicket = ({ eventId, waitingListId }: ReleaseTicketProps) => {
  const [isReleasing, setIsReleasing] = useState<boolean>(false)
  const releaseTicket = useMutation(api.waitingList.releaseTicket)

  const handleRelease = async () => {
    if (!confirm('Are you sure you want to release ticket offer?')) return

    try {
      setIsReleasing(true)
      await releaseTicket({ eventId, waitingListId })
    } catch (error) {
      console.error('Error releasing ticket:', error)
    } finally {
      setIsReleasing(false)
    }
  }
  return (
    <button
      className="mt-2 w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition disable:opacity-50 disabled:cursor-not-allowed"
      disabled={isReleasing}
      onClick={handleRelease}
    >
      <XCircle className="w-4 h-4" />
      {isReleasing ? 'Releasing...' : 'Release Ticket Offer'}
    </button>
  )
}
export default ReleaseTicket
