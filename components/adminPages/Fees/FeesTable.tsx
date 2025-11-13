import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import MarkPaid from "./MarkPaid"
import SendReminder from "./SendReminder"
import FeesTablePagination from "./FeesTablePagination"
import myFetch from "@/lib/requestHelper"
import {  FeesApiResponse } from "@/lib/types"

// Fetch fees with pagination and search
async function fetchFees(page: number = 1, search?: string): Promise<FeesApiResponse | null> {
  try {
    const params = new URLSearchParams()
    params.set("page", String(page))
    if (search) {
      params.set("search", search)
    }

    const response = await myFetch(`/api/admin/fee?${params.toString()}`)

    if (!response.ok) {
      console.error("Failed to fetch fees:", response.status)
      return null
    }

    const data = await response.json()
    return data?.data || null
  } catch (error) {
    console.error("Error fetching fees:", error)
    return null
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "PAID":
      return "default"
    case "DUE":
      return "secondary"
    case "OVERDUE":
      return "destructive"
    default:
      return "outline"
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "PAID":
      return <CheckCircle className="h-4 w-4" />
    case "DUE":
      return <Clock className="h-4 w-4" />
    case "OVERDUE":
      return <AlertTriangle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

export default async function FeesTable({ 
  searchParams,
}: { 
  searchParams?: Promise<{ page?: string; search?: string }> 
}) {
  const params = (await searchParams) ?? {}
  const page = Math.max(1, Number(params.page ?? 1))
  const search = params.search?.trim()

  const feesData = await fetchFees(page, search)

  if (!feesData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fee Collection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Failed to load fee records. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { studentFees, page: currentPage,  totalStudentFeeData } = feesData
  const pageSize = 20 // API returns 20 per page

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Collection Status ({totalStudentFeeData})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {studentFees.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No fee records found</p>
            </div>
          ) : (
            <>
              {studentFees.map((fee) => (
                <div key={fee.studentId} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1">
                    {/* Student Info */}
                    <div>
                      <p className="font-medium">{fee.studentName}</p>
                      <p className="text-sm text-muted-foreground">ID: {fee.studentId}</p>
                    </div>

                    {/* Monthly Fee */}
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Fee</p>
                      <p className="font-bold">₹{fee.fee.toLocaleString("en-IN")}</p>
                    </div>

                    {/* Due Date */}
                    <div>
                      <p className="text-sm text-muted-foreground">Due Date</p>
                      <p className="font-medium">
                        {fee.dueDate && fee.dueDate !== "NA"
                          ? new Date(fee.dueDate).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "-"}
                      </p>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant={getStatusColor(fee.status)} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(fee.status)}
                        <span>{fee.status}</span>
                      </Badge>
                      {fee.paidOn && fee.paidOn !== "NA" && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Paid:{" "}
                          {new Date(fee.paidOn).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      )}
                    </div>

                    {/* Reminders */}
                    <div>
                      <p className="text-sm text-muted-foreground">Reminders</p>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">{fee.ReminderSent}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {fee.status !== "PAID" && <MarkPaid feeId={fee.studentId} />}
                    <SendReminder feeId={fee.studentId} />
                  </div>
                </div>
              ))}

              <FeesTablePagination page={currentPage} pageSize={pageSize} totalItems={totalStudentFeeData} />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
