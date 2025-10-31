"use server"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AddRecord from "./AddRecord"
import SalaryCard from "./SalaryCard"
import SalaryTablePagination from "./SalaryTablePagination"

type Salary = {
  id: string
  teacherId: string
  teacherName: string
  month: string
  year: number
  baseSalary: number
  bonuses: number
  deductions: number
  totalSalary: number
  status: string
  paymentDate?: string
}

async function fetchSalaries(page = 1, pageSize = 10): Promise<{ items: Salary[]; total: number }> {
  // placeholder data
  const items: Salary[] = Array.from({ length: 23 }).map((_, i) => {
    const base = 20000 + (i % 5) * 1000
    const bonuses = (i % 3) * 500
    const deductions = (i % 2) * 200
    return {
      id: String(i + 1),
      teacherId: `t${(i % 6) + 1}`,
      teacherName: `Teacher ${(i % 6) + 1}`,
      month: "Sep",
      year: 2025,
      baseSalary: base,
      bonuses,
      deductions,
      totalSalary: base + bonuses - deductions,
      status: i % 3 === 0 ? "paid" : i % 3 === 1 ? "processing" : "pending",
      paymentDate: i % 3 === 0 ? `2025-09-${(i % 28) + 1}` : undefined,
    }
  })

  const start = (page - 1) * pageSize
  const paged = items.slice(start, start + pageSize)
  return { items: paged, total: items.length }
}

export default async function SalaryTable({ searchParams }: { searchParams?: Record<string, string> | any }) {
  const page = Number(searchParams?.page ?? 1)
  const pageSize = Number(searchParams?.pageSize ?? 10)

  const { items, total } = await fetchSalaries(page, pageSize)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Monthly Salaries</CardTitle>

        {/* client component */}
        <AddRecord />
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {items.map((salary) => (
            <div key={salary.id} className="p-4 border rounded-lg">
              <SalaryCard salary={salary} />
            </div>
          ))}

          <SalaryTablePagination page={page} totalPages={Math.max(1, Math.ceil(total / pageSize))} />
        </div>
      </CardContent>
    </Card>
  )
}
