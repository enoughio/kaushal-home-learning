"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { UserX, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = { userId: string; currentStatus: string }

export default function ToggelUserStatus({ userId, currentStatus }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function toggle() {
    setLoading(true)
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    await fetch(`/api/admin/users/${userId}/status`, { method: 'POST', body: JSON.stringify({ status: newStatus }) })
    setLoading(false)
    router.refresh()
  }

  return (
    <Button variant="outline" size="sm" onClick={toggle} disabled={loading} className="bg-transparent">
      {currentStatus === 'active' ? <UserX className="h-4 w-4" /> : <Users className="h-4 w-4" />}
    </Button>
  )
}
