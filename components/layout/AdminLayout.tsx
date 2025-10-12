import type React from "react"
import { AdminLayout as AdminLayoutWrapper } from "./AdminLayoutWrapper"

interface AdminLayoutProps {
  children: React.ReactNode
  activeTab?: string // Made optional since we'll handle active state in nav links
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
}
