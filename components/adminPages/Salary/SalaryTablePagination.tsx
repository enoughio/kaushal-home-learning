"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"

export default function SalaryTablePagination({ page, totalPages }: { page: number; totalPages: number }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function setPageParam(next: number) {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    params.set("page", String(next))
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-between pt-2">
      <div className="text-sm text-muted-foreground">{/* simple range info handled on server */}</div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="bg-transparent" onClick={() => setPageParam(Math.max(1, page - 1))} disabled={page === 1}>
          Prev
        </Button>
        <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
        <Button variant="outline" size="sm" className="bg-transparent" onClick={() => setPageParam(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
          Next
        </Button>
      </div>
    </div>
  )
}