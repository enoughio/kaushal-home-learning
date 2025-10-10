"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AuthService } from "@/lib/auth"
import type { User as UserType } from "@/lib/auth"
import { AdminLayoutServer } from "./AdminLayoutServer"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Read current user if available. For now we will not redirect if
    // the user is missing or unauthorized — this disables the client-side
    // redirect back to home so the admin dashboard can be accessed during
    // development. We still read the user and stop the loading state.
    const currentUser = AuthService.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  // Only block render while loading. Previously we also blocked when user
  // was null which caused an immediate redirect; that's removed now.
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <AdminLayoutServer>{children}</AdminLayoutServer>
}