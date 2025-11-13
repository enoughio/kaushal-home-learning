"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Loader2, Plus } from "lucide-react"
import { toast } from "react-hot-toast"

interface StudentWithoutFee {
  id: number
  user: {
    first_name: string | null
    last_name: string | null
  }
  parent_name: string | null
  parent_email: string | null
  parent_phone: string | null
}

export default function AddFeeRecord() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [students, setStudents] = useState<StudentWithoutFee[]>([])
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [feeAmount, setFeeAmount] = useState<string>("")
  const [dueDate, setDueDate] = useState<string>("")

  // Fetch students without fee assigned
  useEffect(() => {
    if (open) {
      fetchStudents()
    }
  }, [open])

  const fetchStudents = async () => {
    setFetching(true)
    try {
      const response = await fetch("/api/admin/fee/add")

      if (!response.ok) {
        toast.error("Failed to fetch students")
        return
      }

      const data = await response.json()
      setStudents(data?.data?.students || [])

      if (data?.data?.students?.length === 0) {
        toast.success("All students already have fees assigned")
      }
    } catch (err) {
      console.error("Error fetching students:", err)
      toast.error("Error fetching students")
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!selectedStudent || !feeAmount || !dueDate) {
      toast.error("Please fill all required fields")
      return
    }

    const feeAmountNum = parseFloat(feeAmount)
    if (feeAmountNum < 100) {
      toast.error("Fee amount should be at least ₹100")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/admin/fee/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudent,
          feeAmount: feeAmountNum,
          dueDate: dueDate,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data?.message || "Failed to add fee record")
        return
      }

      toast.success("Fee record added successfully")

      // Reset form
      setSelectedStudent("")
      setFeeAmount("")
      setDueDate("")
      setOpen(false)

      // Refresh the page to show updated data
      window.location.reload()
    } catch (err) {
      console.error("Error adding fee record:", err)
      toast.error("Error adding fee record")
    } finally {
      setLoading(false)
    }
  }

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Fee Record
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Fee Record</DialogTitle>
          <DialogDescription>
            Assign a monthly fee to a student who does not have one yet.
          </DialogDescription>
        </DialogHeader>

        {students.length === 0 && !fetching ? (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              All students already have fees assigned
            </p>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student Select */}
            <div className="space-y-2">
              <Label htmlFor="student">Select Student</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent} disabled={fetching}>
                <SelectTrigger id="student">
                  <SelectValue placeholder={fetching ? "Loading students..." : "Choose a student"} />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={String(student.id)}>
                      {student.user?.first_name} {student.user?.last_name} (ID: {student.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fee Amount */}
            <div className="space-y-2">
              <Label htmlFor="feeAmount">Monthly Fee (₹)</Label>
              <Input
                id="feeAmount"
                type="number"
                min="100"
                step="100"
                placeholder="Enter fee amount (minimum ₹100)"
                value={feeAmount}
                onChange={(e) => setFeeAmount(e.target.value)}
                required
              />
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="dueDate">Fee Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                min={today}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={loading || fetching}
                className="flex-1 gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Fee Record"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
