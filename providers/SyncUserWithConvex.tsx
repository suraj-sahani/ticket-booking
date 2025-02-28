'use client'

import { useUser } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { updateUser } from '@/convex/users'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

const SyncUserWithConvex = () => {
  const { user } = useUser()
  // Update the user in convex
  const updateUser = useMutation(api.users.updateUser)

  useEffect(() => {
    if (!user) return

    const syncUser = async () => {
      try {
        await updateUser({
          userId: user.id,
          name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
          email: user.emailAddresses[0]?.emailAddress ?? '',
        })
      } catch (error) {
        console.error('Failed to sync user:', error)
      }
    }

    syncUser()
  }, [user, updateUser])
  return null
}

export default SyncUserWithConvex
