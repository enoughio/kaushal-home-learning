"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Edit, Check, X } from "lucide-react"
import { useRouter } from "next/navigation"

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

function getStatusColor(status: string) {
  switch (status) {
    case "paid":
      return "default"
    case "processing":
      return "secondary"
    case "pending":
      return "destructive"
    default:
      return "outline"
  }
}

export default function SalaryCard({ salary }: { salary: Salary }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    baseSalary: salary.baseSalary,
    bonuses: salary.bonuses,
    deductions: salary.deductions,
  })
  const router = useRouter()

  async function handleSave() {
    // placeholder POST - replace with real API call
    await fetch(`/api/admin/salaries/${salary.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setEditing(false)
    router.refresh()
  }

  return (
    <div className="flex items-center justify-between">
      {editing ? (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 w-full">
          <div>
            <Label>Teacher</Label>
            <p className="text-sm font-medium">{salary.teacherName}</p>
          </div>
          <div>
            <Label>Base Salary</Label>
            <Input
              type="number"
              value={form.baseSalary}
              onChange={(e: any) => setForm((p) => ({ ...p, baseSalary: Number(e.target.value) }))}
            />
          </div>
          <div>
            <Label>Bonuses</Label>
            <Input
              type="number"
              value={form.bonuses}
              onChange={(e: any) => setForm((p) => ({ ...p, bonuses: Number(e.target.value) }))}
            />
          </div>
          <div>
            <Label>Deductions</Label>
            <Input
              type="number"
              value={form.deductions}
              onChange={(e: any) => setForm((p) => ({ ...p, deductions: Number(e.target.value) }))}
            />
          </div>
          <div>
            <Label>Total</Label>
            <p className="text-sm font-medium">₹{(form.baseSalary + form.bonuses - form.deductions).toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 flex-1">
            <div>
              <p className="font-medium">{salary.teacherName}</p>
              <p className="text-sm text-muted-foreground">{salary.month} {salary.year}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Base</p>
              <p className="font-medium">₹{salary.baseSalary.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bonuses</p>
              <p className="font-medium text-chart-1">+₹{salary.bonuses.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Deductions</p>
              <p className="font-medium text-chart-2">-₹{salary.deductions.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="font-bold">₹{salary.totalSalary.toLocaleString()}</p>
            </div>
            <div>
              <Badge variant={getStatusColor(salary.status)}>{salary.status}</Badge>
              {salary.paymentDate && <p className="text-xs text-muted-foreground mt-1">Paid: {salary.paymentDate}</p>}
            </div>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
            <Edit className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  )
}

export function SalaryCardSkeleton() {
  return (
    <div className="h-16 bg-muted rounded" />
  )
}

