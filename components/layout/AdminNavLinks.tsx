"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Users, UserCheck, BarChart3, DollarSign, Home, Shield } from "lucide-react"

const links = [
  { name: "Dashboard", href: "/admin", icon: Home, id: "dashboard" },
  { name: "User Management", href: "/admin/users", icon: Users, id: "users" },
  { name: "Teacher Approvals", href: "/admin/approvals", icon: UserCheck, id: "approvals" },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3, id: "analytics" },
  { name: "Payments", href: "/admin/payments", icon: DollarSign, id: "payments" },
  { name: "Teacher Salaries", href: "/admin/salaries", icon: DollarSign, id: "salaries" },
  { name: "Student Fees", href: "/admin/fees", icon: Users, id: "fees" },
  { name: "Notifications", href: "/admin/notifications", icon: Shield, id: "notifications" },
]

export function AdminNavLinks() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className="flex-1 p-4 space-y-2">
      {links.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        
        return (
          <Button
            key={item.name}
            variant={isActive ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => router.push(item.href)}
          >
            <Icon className="mr-3 h-4 w-4" />
            {item.name}
          </Button>
        )
      })}
    </nav>
  )
}