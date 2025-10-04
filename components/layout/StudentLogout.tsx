"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth"

export function StudentLogout() {
  const router = useRouter()

  const handleLogout = () => {
    AuthService.logout()
    router.push("/")
  }

  return (
    <div className="p-4 border-t border-border">
      <Button
        variant="outline"
        className="w-full justify-start bg-transparent"
        onClick={handleLogout}
      >
        <LogOut className="mr-3 h-4 w-4" />
        Logout
      </Button>
    </div>
  )
}