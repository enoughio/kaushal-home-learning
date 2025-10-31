"use server"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, AlertTriangle, CheckCircle } from "lucide-react"

// placeholder fetch
async function fetchFeesStats() {
  return {
    totalCollected: 78000,
    totalPending: 22000,
    overdueCount: 12,
    fees: [
      { id: "1", status: "paid" },
      { id: "2", status: "due" },
    ],
  }
}

export default async function FeesStats() {
  const { totalCollected, totalPending, overdueCount, fees } = await fetchFeesStats()

  const collectionRate = Math.round((fees.filter((f: any) => f.status === "paid").length / Math.max(1, fees.length)) * 100)

  return (
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
              <p className="text-2xl font-bold">{collectionRate}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-chart-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}