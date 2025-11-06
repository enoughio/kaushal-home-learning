"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { UserX, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

type Props = { userId: string; currentStatus: boolean }

export default function ToggelUserStatus({ userId, currentStatus }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function toggle() {
    setLoading(true)
    try {
      // Toggle the status: active -> inactive, inactive -> active
      const newStatus = !currentStatus
      const statusString = newStatus ? "active" : "inactive"

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: statusString }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `Failed to update user status (${response.status})`)
      }

      toast.success(`User has been ${statusString}`)
      router.refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to toggle user status'
      console.error('Error toggling user status:', error)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggle}
      disabled={loading}
      className="bg-transparent"
      title={currentStatus ? "Click to deactivate user" : "Click to activate user"}
    >
      {currentStatus === true ? <UserX className="h-4 w-4" /> : <Users className="h-4 w-4" />}
    </Button>
  )
}
