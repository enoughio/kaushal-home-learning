"use client"

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

type Props = { page: number; totalPages: number }

export default function Pagination({ page, totalPages }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function goTo(newPage: number) {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    params.set('page', String(newPage))
    router.push(`/admin/users?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="bg-transparent" onClick={() => goTo(Math.max(1, page - 1))} disabled={page === 1}>
        Prev
      </Button>
      <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
      <Button variant="outline" size="sm" className="bg-transparent" onClick={() => goTo(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
        Next
      </Button>
    </div>
  )
}
