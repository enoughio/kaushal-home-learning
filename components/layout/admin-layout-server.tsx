import type React from "react"
import { AdminSideNav } from "./admin-sidenav"
import { AdminMobileHeader } from "./admin-mobile-header"

interface AdminLayoutServerProps {
  children: React.ReactNode
}

export function AdminLayoutServer({ children }: AdminLayoutServerProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-card lg:border-r lg:border-border">
        <AdminSideNav />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <AdminMobileHeader />

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}