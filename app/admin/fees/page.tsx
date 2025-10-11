"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AdminDataService, type StudentFee } from "@/lib/admin-data"
import { DollarSign, AlertTriangle, CheckCircle, Clock, Mail } from "lucide-react"

export default function StudentFeesPage() {
  const [fees, setFees] = useState<StudentFee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFees = async () => {
      try {
        const data = await AdminDataService.getStudentFees()
        setFees(data)
      } catch (error) {
        console.error("Failed to load student fees:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFees()
  }, [])

  const handleMarkPaid = async (feeId: string) => {
    try {
      await AdminDataService.updateStudentFeeStatus(feeId, "paid", new Date().toISOString().split("T")[0])
      setFees((prev) =>
        prev.map((f) =>
          f.id === feeId ? { ...f, status: "paid", paidDate: new Date().toISOString().split("T")[0] } : f,
        ),
      )
    } catch (error) {
      console.error("Failed to update fee status:", error)
    }
  }

  const getStatusColor = (status: StudentFee["status"]) => {
    switch (status) {
      case "paid":
        return "default"
      case "due":
        return "secondary"
      case "overdue":
        return "destructive"
      case "grace_period":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: StudentFee["status"]) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4" />
      case "due":
        return <Clock className="h-4 w-4" />
      case "overdue":
        return <AlertTriangle className="h-4 w-4" />
      case "grace_period":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <AdminLayout activeTab="fees">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading student fees...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const totalCollected = fees.filter((f) => f.status === "paid").reduce((sum, f) => sum + f.monthlyFee, 0)
  const totalPending = fees.filter((f) => f.status !== "paid").reduce((sum, f) => sum + f.monthlyFee, 0)
  const overdueCount = fees.filter((f) => f.status === "overdue").length

  return (
    <AdminLayout activeTab="fees">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Student Fees</h1>
          <p className="text-muted-foreground">Monitor monthly fee collection and payment status</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Collected</p>
                  <p className="text-2xl font-bold">₹{totalCollected.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-chart-1" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Collection</p>
                  <p className="text-2xl font-bold">₹{totalPending.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-chart-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overdue Payments</p>
                  <p className="text-2xl font-bold">{overdueCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-chart-3" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Collection Rate</p>
                  <p className="text-2xl font-bold">
                    {Math.round((fees.filter((f) => f.status === "paid").length / fees.length) * 100)}%
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-chart-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fees Table */}
        <Card>
          <CardHeader>
            <CardTitle>Fee Collection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fees.map((fee) => (
                <div key={fee.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1">
                    <div>
                      <p className="font-medium">{fee.studentName}</p>
                      <p className="text-sm text-muted-foreground">Student ID: {fee.studentId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Fee</p>
                      <p className="font-bold">₹{fee.monthlyFee.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Due Date</p>
                      <p className="font-medium">{fee.dueDate}</p>
                      {fee.gracePeriodEnd && (
                        <p className="text-xs text-muted-foreground">Grace: {fee.gracePeriodEnd}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant={getStatusColor(fee.status)} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(fee.status)}
                        {fee.status.replace("_", " ")}
                      </Badge>
                      {fee.paidDate && <p className="text-xs text-muted-foreground mt-1">Paid: {fee.paidDate}</p>}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reminders</p>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">{fee.remindersSent}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {fee.status !== "paid" && (
                      <Button size="sm" onClick={() => handleMarkPaid(fee.id)}>
                        Mark Paid
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      Send Reminder
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
