import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { DollarSign, AlertTriangle } from 'lucide-react'
import myFetch from '@/lib/requestHelper'

interface SalaryStats {
  totalSalaries: number
  dueSalaries: number
  activeTeachers: number
}

async function fetchSalaryStats(): Promise<SalaryStats | null> {
  try {
    const response = await myFetch('/api/admin/salary/stats')

    if (!response.ok) {
      console.error('Failed to fetch salary stats:', response.status)
      return null
    }

    const data = await response.json()
    return data.data || null
  } catch (error) {
    console.error('Error fetching salary stats:', error)
    return null
  }
}

export default async function SalaryStats() {
  const stats = await fetchSalaryStats()

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-3 w-24 bg-neutral-200 rounded mb-2" />
                  <div className="h-6 w-20 bg-neutral-300 rounded" />
                </div>
                <div className="h-8 w-8 bg-neutral-200 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const { totalSalaries, dueSalaries, activeTeachers } = stats

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Salaries</p>
              <p className="text-2xl font-bold">₹{totalSalaries.toLocaleString('en-IN')}</p>
            </div>
            <DollarSign className="h-8 w-8 text-chart-1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Due Salaries</p>
              <p className="text-2xl font-bold text-destructive">
                ₹{dueSalaries.toLocaleString('en-IN')}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-destructive" />
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
