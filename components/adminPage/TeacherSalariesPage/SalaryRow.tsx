"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Edit, Check, X } from "lucide-react"
import { type TeacherSalary } from "@/lib/adminData"

interface SalaryRowProps {
  salary: TeacherSalary
  onUpdate: (id: string, data: Partial<TeacherSalary>) => void
}

export function SalaryRow({ salary, onUpdate }: SalaryRowProps) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<Partial<TeacherSalary>>({})

  const handleEdit = () => {
    setEditing(true)
    setForm(salary)
  }

  const handleCancel = () => {
    setEditing(false)
    setForm({})
  }

  const handleSave = async () => {
    await onUpdate(salary.id, form)
    setEditing(false)
    setForm({})
  }

  const getStatusColor = (status: TeacherSalary["status"]) => {
    switch (status) {
      case "paid": return "default"
      case "processing": return "secondary"
      case "pending": return "destructive"
      default: return "outline"
    }
  }

  return (
    <div className="p-4 border rounded-lg">
      {editing ? (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <Label>Teacher</Label>
            <p className="text-sm font-medium">{salary.teacherName}</p>
          </div>
          <div>
            <Label>Base Salary</Label>
            <Input type="number" value={form.baseSalary || 0} onChange={(e) => setForm((prev) => ({ ...prev, baseSalary: Number(e.target.value) }))} />
          </div>
          <div>
            <Label>Bonuses</Label>
            <Input type="number" value={form.bonuses || 0} onChange={(e) => setForm((prev) => ({ ...prev, bonuses: Number(e.target.value) }))} />
          </div>
          <div>
            <Label>Deductions</Label>
            <Input type="number" value={form.deductions || 0} onChange={(e) => setForm((prev) => ({ ...prev, deductions: Number(e.target.value) }))} />
          </div>
          <div>
            <Label>Total</Label>
            <p className="text-sm font-medium">₹{((form.baseSalary || 0) + (form.bonuses || 0) - (form.deductions || 0)).toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}><Check className="h-4 w-4" /></Button>
            <Button size="sm" variant="outline" onClick={handleCancel}><X className="h-4 w-4" /></Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
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
          <Button size="sm" variant="ghost" onClick={handleEdit}><Edit className="h-4 w-4" /></Button>
        </div>
      )}
    </div>
  )
}