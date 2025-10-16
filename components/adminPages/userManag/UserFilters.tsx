"use client"

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = { initial?: { search?: string; role?: string; status?: string } }

export default function UserFilters({ initial }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState(initial?.search ?? '')
  const [role, setRole] = useState(initial?.role ?? 'all')
  const [status, setStatus] = useState(initial?.status ?? 'all')

  function applyFilters() {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (role) params.set('role', role)
    if (status) params.set('status', status)
    router.push(`/admin/users?${params.toString()}`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch((e.target as HTMLInputElement).value)} className="pl-10 bg-input" onKeyDown={(e) => e.key === 'Enter' && applyFilters()} />
      </div>

      <Select value={role} onValueChange={(v) => setRole(v)}>
        <SelectTrigger className="bg-input"><SelectValue placeholder="Filter by role" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="student">Students</SelectItem>
          <SelectItem value="teacher">Teachers</SelectItem>
          <SelectItem value="admin">Admins</SelectItem>
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={(v) => setStatus(v)}>
        <SelectTrigger className="bg-input"><SelectValue placeholder="Filter by status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
        </SelectContent>
      </Select>

      <div className="md:col-span-3 flex justify-end">
        <button className="btn" onClick={applyFilters}>Apply</button>
      </div>
    </div>
  )
}