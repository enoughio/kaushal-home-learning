
"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"

const MarkPaid = ({ feeId }: { feeId: string }) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleMarkPaid = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/fee/${feeId}/paid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod: "BANK_TRANSFER",
          date: new Date().toISOString(),
          amount: 0, // Amount will be fetched from student's monthly_fee
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data?.message || "Failed to mark as paid")
        return
      }

      toast.success("Fee marked as paid successfully")
      router.refresh()
    } catch (err) {
      console.error("Error marking paid:", err)
      toast.error("Error marking fee as paid")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      size="sm"
      onClick={handleMarkPaid}
      disabled={loading}
      className="gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Marking...
        </>
      ) : (
        <>
          <CheckCircle className="h-4 w-4" />
          Mark Paid
        </>
      )}
    </Button>
  )
}

export default MarkPaid