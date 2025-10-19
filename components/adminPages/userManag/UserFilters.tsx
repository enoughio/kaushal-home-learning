"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

type Props = {
  initial?: {
    search?: string
    role?: string
    status?: string
  }
}

export default function UserFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathName = usePathname()

  const [search, setSearch] = useState("")
  const [role, setRole] = useState("all")
  const [status, setStatus] = useState("all")

  //  Debounced update for search input
  const handleSearchChange = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) params.set("search", term)
    else params.delete("search")

    if (role !== "all") params.set("role", role)
    else params.delete("role")

    if (status !== "all") params.set("status", status)
    else params.delete("status")

    router.replace(`${pathName}?${params.toString()}`)
  }, 500)

  // Unified function to apply filters (for Apply button or dropdowns)
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams)
    if (search) params.set("search", search)
    else params.delete("search")

    if (role !== "all") params.set("role", role)
    else params.delete("role")

    if (status !== "all") params.set("status", status)
    else params.delete("status")

    router.replace(`${pathName}?${params.toString()}`)
  }

  // 🔄 When role or status changes, apply filters immediately
  useEffect(() => {
    applyFilters()
  }, [role, status]) // only trigger when dropdowns change

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            handleSearchChange(e.target.value)
          }}
          className="pl-10 bg-input"
        />
      </div>

      <Select value={role} onValueChange={(v) => setRole(v)}>
        <SelectTrigger className="bg-input">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="student">Students</SelectItem>
          <SelectItem value="teacher">Teachers</SelectItem>
          <SelectItem value="admin">Admins</SelectItem>
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={(v) => setStatus(v)}>
        <SelectTrigger className="bg-input">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
        </SelectContent>
      </Select>

      <div className="md:col-span-3 flex justify-end">
        <button
          onClick={applyFilters}
          className="bg-primary text-white rounded-md px-4 py-2 hover:opacity-90 transition"
        >
          Apply
        </button>
      </div>
    </div>
  )
}
