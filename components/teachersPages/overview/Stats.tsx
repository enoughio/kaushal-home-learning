import React from 'react'
import { Card, CardContent } from '../../ui/card'
import { DollarSign, FileText, TrendingUp, Users } from 'lucide-react'

// --- Types for the mocked data ---
export interface Student {
  id: string
  name: string
  active: boolean
}

export interface Assignment {
  id: string
  title: string
  status: 'pending' | 'submitted' | 'graded'
}

export interface Payment {
  id: string
  studentId: string
  amount: number
  status: 'pending' | 'paid'
}

/**
 * Static mock data for the teacher stats component.
 * Note: These values are currently static for local development.
 * In future they'll be provided by an API; keep the shape to match the API.
 */
export const mockActiveStudents: Student[] = [
  { id: 's1', name: 'Asha Verma', active: true },
  { id: 's2', name: 'Rohan Singh', active: true },
  { id: 's3', name: 'Priya Patel', active: true },
  { id: 's4', name: 'Karthik Rao', active: true },
]

export const mockPendingAssignments: Assignment[] = [
  { id: 'a1', title: 'Algebra Homework', status: 'pending' },
  { id: 'a2', title: 'History Essay', status: 'pending' },
]

export const mockPendingPayments: Payment[] = [
  { id: 'p1', studentId: 's2', amount: 500, status: 'pending' },
  { id: 'p2', studentId: 's3', amount: 750, status: 'pending' },
]

// Example total earnings (already paid amounts + any other revenue)
export const mockTotalEarnings = 12500

export const mockTeacherStats = {
  activeStudents: mockActiveStudents,
  pendingAssignments: mockPendingAssignments,
  pendingPayments: mockPendingPayments,
  totalEarnings: mockTotalEarnings,
}

/**
 * Stats — displays teacher dashboard summary.
 * Uses exported mock data by default so this component is usable offline.
 */
export function Stats({
  activeStudents = mockActiveStudents,
  pendingAssignments = mockPendingAssignments,
  pendingPayments = mockPendingPayments,
  totalEarnings = mockTotalEarnings,
}: Partial<typeof mockTeacherStats> & { activeStudents?: Student[] }) {
  const pendingPaymentsSum = pendingPayments.reduce((sum, p) => sum + (p?.amount || 0), 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Students</p>
              <p className="text-2xl font-bold">{activeStudents.length}</p>
            </div>
            <Users className="h-8 w-8 text-chart-1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold">₹{Number(totalEarnings).toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-chart-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Reviews</p>
              <p className="text-2xl font-bold">{pendingAssignments.length}</p>
            </div>
            <FileText className="h-8 w-8 text-chart-3" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Payments</p>
              <p className="text-2xl font-bold">₹{pendingPaymentsSum.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-chart-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Stats
