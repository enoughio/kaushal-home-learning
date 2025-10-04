"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, Search, Home, FileText, Clock, X } from "lucide-react"

export function StudentNavLinks() {
  const router = useRouter()
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/student", icon: Home },
    { name: "Find Teachers", href: "/student/teachers", icon: Search },
    { name: "Assignments", href: "/student/assignments", icon: FileText },
    { name: "Attendance", href: "/student/attendance", icon: Calendar },
    { name: "History", href: "/student/history", icon: Clock },
    { name: "Profile", href: "/student/profile", icon: X },
  ]

  return (
    <nav className="flex-1 p-4 space-y-2">
      {navigation.map((item) => {
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