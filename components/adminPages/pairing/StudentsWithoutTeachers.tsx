"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

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

interface StudentsWithoutTeachersProps {
  students: Student[]
  loading?: boolean
}

const StudentsWithoutTeachers = ({ students, loading = false }: StudentsWithoutTeachersProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Students Without Teachers (Loading...)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading students...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Students Without Teachers ({students.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {students.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">All students have been assigned teachers!</p>
        ) : (
          <div className="space-y-2">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm md:text-base">{student.name}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{student.email}</p>
                  <div className="flex flex-wrap gap-2 mt-2 text-xs">
                    <span className="text-muted-foreground">📍 {student.location}</span>
                    <span className="text-muted-foreground">📞 {student.parentPhone}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="ml-2 flex-shrink-0">
                  Unassigned
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default StudentsWithoutTeachers
