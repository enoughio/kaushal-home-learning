"use server"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { DollarSign } from "lucide-react"

// Placeholder fetch: replace with real API call
async function fetchSalaryData() {
  // simulate fetching
  return {
    totalPaid: 125000,
    totalPending: 45000,
    salaries: [
      { id: "1", teacherId: "t1" },
      { id: "2", teacherId: "t2" },
      { id: "3", teacherId: "t1" },
    ],
  }
}

export default async function SalaryStats() {
  const { totalPaid, totalPending, salaries } = await fetchSalaryData()

  const activeTeachers = new Set(salaries.map((s: any) => s.teacherId)).size

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
              <p className="text-2xl font-bold">₹{totalPaid.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-chart-1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Payments</p>
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
              <p className="text-sm font-medium text-muted-foreground">Active Teachers</p>
              <p className="text-2xl font-bold">{activeTeachers}</p>
            </div>
            <DollarSign className="h-8 w-8 text-chart-3" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
