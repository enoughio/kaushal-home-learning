"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Calendar, Search, LogOut, Home, FileText, Clock, Menu, X } from "lucide-react"
import type { User as UserType } from "@/lib/auth" // Renamed to avoid redeclaration

interface StudentLayoutProps {
  children: React.ReactNode
  activeTab: string
}

export function StudentLayout({ children, activeTab }: StudentLayoutProps) {
  const [user, setUser] = useState<UserType | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser || currentUser.role !== "student") {
      router.push("/")
      return
    }
    setUser(currentUser)
  }, [router])

  const handleLogout = () => {
    AuthService.logout()
    router.push("/")
  }

  const navigation = [
    { name: "Dashboard", href: "/student", icon: Home, id: "dashboard" },
    { name: "Find Teachers", href: "/student/teachers", icon: Search, id: "teachers" },
    { name: "Assignments", href: "/student/assignments", icon: FileText, id: "assignments" },
    { name: "Attendance", href: "/student/attendance", icon: Calendar, id: "attendance" },
    { name: "History", href: "/student/history", icon: Clock, id: "history" },
    { name: "Profile", href: "/student/profile", icon: X, id: "profile" }, // Updated icon to X
  ]

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h1 className="text-xl font-bold text-primary">Kaushaly</h1>
              <p className="text-sm text-muted-foreground">Student Portal</p>
            </div>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <X className="h-5 w-5 text-primary-foreground" /> {/* Updated icon to X */}
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    router.push(item.href)
                    setSidebarOpen(false)
                  }}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Button>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleLogout}>
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 bg-background border-b border-border lg:hidden">
          <div className="flex items-center justify-between p-4">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Kaushaly</h1>
            </div>
            <div className="w-8" /> {/* Spacer */}
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
