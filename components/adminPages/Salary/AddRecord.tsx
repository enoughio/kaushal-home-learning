'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Plus, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface Teacher {
  id: string
  name: string
}

export default function AddRecord() {
  const [open, setOpen] = useState(false)
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [selectedTeacher, setSelectedTeacher] = useState<string>('')
  const [baseSalary, setBaseSalary] = useState<number>(0)
  const [payDay, setPayDay] = useState<number>(1)
  const [loading, setLoading] = useState(false)
  const [fetchingTeachers, setFetchingTeachers] = useState(false)
  const router = useRouter()

  // Fetch teachers without salary assigned
  useEffect(() => {
    if (!open) return

    async function loadTeachers() {
      setFetchingTeachers(true)
      try {
        const response = await fetch('/api/admin/salary?assigned_status=false')

        if (!response.ok) {
          console.error('Failed to fetch teachers:', response.status)
          return
        }

        const data = await response.json()
        const teacherList =
          data.data?.teacherSalary?.map((t: { id: number; name : string  }) => ({
            id: t.id,
            name: t.name,
          })) || []

        setTeachers(teacherList)
      } catch (error) {
        console.error('Error fetching teachers:', error)
        toast.error('Failed to load teachers')
      } finally {
        setFetchingTeachers(false)
      }
    }

    loadTeachers()
  }, [open])

  async function handleCreate() {
    if (!selectedTeacher || !baseSalary) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/salary/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: selectedTeacher,
          baseSalary,
          payDay,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `Failed to add salary record (${response.status})`)
      }

      toast.success('Salary record added successfully')
      setOpen(false)
      setSelectedTeacher('')
      setBaseSalary(0)
      setPayDay(1)
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add salary record'
      console.error('Error:', error)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Add Salary Record
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Salary Record</AlertDialogTitle>
            <AlertDialogDescription>
              Add a new salary record for a teacher
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="teacher">Teacher</Label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher} disabled={fetchingTeachers}>
                <SelectTrigger id="teacher">
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">No teachers available</div>
                  ) : (
                    teachers.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="salary">Base Salary</Label>
              <Input
                id="salary"
                type="number"
                placeholder="Enter base salary"
                value={baseSalary || ''}
                onChange={(e) => setBaseSalary(Number(e.target.value))}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="payDay">Pay Day</Label>
              <Input
                id="payDay"
                type="number"
                min="1"
                max="31"
                placeholder="Day of month (1-31)"
                value={payDay}
                onChange={(e) => setPayDay(Math.max(1, Math.min(31, Number(e.target.value))))}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCreate} disabled={loading || !selectedTeacher || !baseSalary}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating
                </>
              ) : (
                'Create'
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
