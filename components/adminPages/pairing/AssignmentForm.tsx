"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { UserPlus, Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface Student {
  id: string
  name: string
  email: string
  parentPhone: string
  location: string
  pincode: string
  status: string
  enrolledAt: string
}

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

interface AssignmentFormProps {
  students: Student[]
  teachers: Teacher[]
}

const AssignmentForm = ({ students, teachers }: AssignmentFormProps) => {
  const router = useRouter()
  const [selectedStudent, setSelectedStudent] = useState("")
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [assigning, setAssigning] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const handleAssign = async () => {
    if (!selectedStudent || !selectedTeacher) {
      toast.error("Please select both a student and a teacher")
      return
    }

    setAssigning(true)
    try {
      const response = await fetch(
        `/api/admin/assign-teacher/${selectedStudent}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teacherId: selectedTeacher }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `Failed to assign teacher (${response.status})`)
      }

      setSuccessMessage(data.data?.message || "Teacher assigned successfully!")
      toast.success("Teacher assigned successfully!")
      
      // Clear selections
      setSelectedStudent("")
      setSelectedTeacher("")
      
      // Refresh page data
      router.refresh()
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to assign teacher"
      console.error("Assignment error:", error)
      toast.error(message)
    } finally {
      setAssigning(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Assign Teacher to Student
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {successMessage && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-center gap-2">
            <Check className="h-4 w-4" />
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Student</label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent} disabled={assigning}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a student" />
              </SelectTrigger>
              <SelectContent>
                {students.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">No students available</div>
                ) : (
                  students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Select Teacher</label>
            <Select value={selectedTeacher} onValueChange={setSelectedTeacher} disabled={assigning}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">No teachers available</div>
                ) : (
                  teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                      {teacher.firstName} {teacher.lastName} ({teacher.currentStudents}/{teacher.maxStudents})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleAssign}
              disabled={assigning || !selectedStudent || !selectedTeacher || students.length === 0 || teachers.length === 0}
              className="w-full"
            >
              {assigning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                "Assign Teacher"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AssignmentForm