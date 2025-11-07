"use server"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, AlertTriangle, CheckCircle } from "lucide-react"
import myFetch from "@/lib/requestHelper"

interface FeesStatsResponse {
  totalCollection: number
  dueFees: number
  pendingFees: number
}

// Fetch fees statistics from API
async function fetchFeesStats(): Promise<FeesStatsResponse> {
  try {
    const res = await myFetch("/api/admin/fee/stats")
    
    if (!res.ok) {
      console.error("Failed to fetch fees stats:", res.status)
      return {
        totalCollection: 0,
        dueFees: 0,
        pendingFees: 0,
      }
    }

    const data = await res.json()
    return data?.data || {
      totalCollection: 0,
      dueFees: 0,
      pendingFees: 0,
    }
  } catch (error) {
    console.error("Error fetching fees stats:", error)
    return {
      totalCollection: 0,
      dueFees: 0,
      pendingFees: 0,
    }
  }
}

export default async function FeesStats() {
  const { totalCollection, dueFees, pendingFees } = await fetchFeesStats()

  // Calculate collection rate as percentage of total fees
  const totalFees = dueFees + pendingFees + totalCollection
  const collectionRate = totalFees > 0 ? Math.round((totalCollection / totalFees) * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Collected */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Collected</p>
              <p className="text-2xl font-bold">₹{totalCollection.toLocaleString('en-IN')}</p>
            </div>
            <DollarSign className="h-8 w-8 text-chart-1" />
          </div>
        </CardContent>
      </Card>

      {/* Pending Collection */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Collection</p>
              <p className="text-2xl font-bold">₹{pendingFees.toLocaleString('en-IN')}</p>
            </div>
            <DollarSign className="h-8 w-8 text-chart-2" />
          </div>
        </CardContent>
      </Card>

      {/* Overdue Fees */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Overdue Payments</p>
              <p className="text-2xl font-bold">₹{dueFees.toLocaleString('en-IN')}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-chart-3" />
          </div>
        </CardContent>
      </Card>

      {/* Collection Rate */}
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