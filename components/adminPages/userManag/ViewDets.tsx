"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = { userId: string }

export default function ViewDets({ userId }: Props) {
  const router = useRouter()
  return (
    <Button variant="outline" size="sm" className="bg-transparent" onClick={() => router.push(`/admin/users/${userId}`)}>
      <Eye className="h-4 w-4" />
    </Button>
  )
}
