"use client"

import React, { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Edit, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"


interface Teacher {
  id: number
  firstName: string
  lastName: string
  email: string
  location: string
  qualification: string
  subjectsTaught: string[]
  currentStudents: number
  maxStudents: number
}

interface ChangePairTeacherProps {
  pairId: number
  studentId: string
  currentTeacherId: string
  currentTeacherName: string
  teachers: Teacher[]
}

export default function ChangePairTeacher({
  pairId,
  studentId,
  currentTeacherId,
  currentTeacherName,
  teachers,
}: ChangePairTeacherProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [updating, setUpdating] = useState(false)

  const handleChange = async () => {
    if (!selectedTeacher) {
      toast.error("Please select a teacher")
      return
    }

    if (selectedTeacher === currentTeacherId) {
      toast.error("Please select a different teacher")
      return
    }

    setUpdating(true)
    try {
      const response = await fetch(
        `/api/admin/assign-teacher/${studentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teacherId: selectedTeacher }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || `Failed to update assignment (${response.status})`
        )
      }

      toast.success(data.data?.message || "Teacher updated successfully!")
      setOpen(false)
      setSelectedTeacher("")
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update teacher"
      console.error("Update error:", error)
      toast.error(message)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        disabled={updating}
        className="gap-2"
      >
        <Edit className="h-4 w-4" />
        Change
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-md bg-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Change Teacher Assignment</AlertDialogTitle>
            <AlertDialogDescription>
              Current teacher: <span className="font-semibold">{currentTeacherName}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select New Teacher</label>
              <Select
                value={selectedTeacher}
                onValueChange={setSelectedTeacher}
                disabled={updating}
              >
                <SelectTrigger className="border-2 border-black">
                  <SelectValue placeholder="Choose a teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers
                    .filter((t) => t.id.toString() !== currentTeacherId)
                    .map((teacher) => (
                      <SelectItem
                        key={teacher.id}
                        value={teacher.id.toString()}
                        disabled={teacher.currentStudents >= teacher.maxStudents}
                      >
                        {teacher.firstName} {teacher.lastName} (
                        {teacher.currentStudents}/{teacher.maxStudents})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <AlertDialogCancel disabled={updating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={updating || !selectedTeacher}
              onClick={handleChange}
              className="gap-2"
            >
              {updating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
