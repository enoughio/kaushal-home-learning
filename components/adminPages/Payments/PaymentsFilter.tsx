"use client"

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function PaymentsFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [status, setStatus] = useState(searchParams.get('status') ?? 'all')

  function apply() {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    if (search) params.set('search', search)
    else params.delete('search')
    if (status) params.set('status', status)
    router.push(`/admin/payments?${params.toString()}`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input placeholder="Search by student, teacher, or subject..." value={search} onChange={(e) => setSearch((e.target as HTMLInputElement).value)} className="pl-10 bg-input" />
      </div>

      <Select value={status} onValueChange={(v) => setStatus(v)}>
        <SelectTrigger className="bg-input"><SelectValue placeholder="Filter by status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Payments</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="due">Due</SelectItem>
          <SelectItem value="overdue">Overdue</SelectItem>
        </SelectContent>
      </Select>

      <div className="md:col-span-2 flex justify-end">
        <button className="btn" onClick={apply}>Apply</button>
      </div>
    </div>
  )
}
