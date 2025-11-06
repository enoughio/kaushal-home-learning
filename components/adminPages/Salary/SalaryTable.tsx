import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'
import AddRecord from './AddRecord'
import SalaryCard from './SalaryCard'
import SalaryTablePagination from './SalaryTablePagination'
import myFetch from '@/lib/requestHelper'


interface Salary {
  id: string
  teacherId: number
  name: string
  email: string
  payDate: string
  base: number
  thisMonthStatus: 'paid' | 'due'
  thisMonthPaidDate: string
}

interface SalaryResponse {
  teacherSalary: Salary[]
  pagination: {
    page: number
    totalPages: number
    total: number
  }
}


async function fetchSalaries(page: number = 1): Promise<SalaryResponse | null> {
  try {
    const params = new URLSearchParams()
    params.set('page', String(page))

    const response = await myFetch(`/api/admin/salary?${params.toString()}`)

    if (!response.ok) {
      console.error('Failed to fetch salaries:', response.status)
      return null
    }

    const data = await response.json()
    return data.data || null
  } catch (error) {
    console.error('Error fetching salaries:', error)
    return null
  }
}

export default async function SalaryTable({ 
  searchParams,
  adminId,
}: { 
  searchParams?: Promise<{ page?: string }>
  adminId: number
}) {
  const params = (await searchParams) ?? {}
  const page = Math.max(1, Number(params.page ?? 1))

  const salaryData = await fetchSalaries(page)

  if (!salaryData) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Monthly Salaries</CardTitle>
          <AddRecord />
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Failed to load salary records. Please try again later.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { teacherSalary, pagination } = salaryData

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Monthly Salaries ({pagination.total})</CardTitle>
        <AddRecord />
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {teacherSalary.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No salary records found</p>
            </div>
          ) : (
            <>
              {teacherSalary.map((salary) => (
                <div key={salary.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <SalaryCard salary={salary} processedBy={adminId} />
                </div>
              ))}

              <SalaryTablePagination page={pagination.page} totalPages={pagination.totalPages} />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
