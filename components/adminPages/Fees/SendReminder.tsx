

"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Mail, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"

const SendReminder = ({ feeId }: { feeId: string }) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSend = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/fee/${feeId}/send-reminder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data?.message || "Failed to send reminder")
        return
      }

      toast.success("Reminder sent successfully")
      router.refresh()
    } catch (err) {
      console.error("Error sending reminder:", err)
      toast.error("Error sending reminder")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleSend}
      disabled={loading}
      className="gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          <Mail className="h-4 w-4" />
          Send Reminder
        </>
      )}
    </Button>
  )
}

export default SendReminder