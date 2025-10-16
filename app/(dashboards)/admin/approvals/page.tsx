import React from 'react'
import { AlertCircle, UserCheck } from 'lucide-react'
import RequestCard from '@/components/adminPages/TeachersApprovals/RequestCard'
import ApprovalsStats from '@/components/adminPages/TeachersApprovals/ApprovalsStats'

type Teacher = {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  appliedDate?: string
  experience?: number
  idProof?: string
  skillsToTeach?: string[]
}

async function fetchPendingTeachers(): Promise<Teacher[]> {
  // placeholder data — replace with API call
  return [
    { id: 't1', name: 'Sonia Kapoor', email: 'sonia@example.com', phone: '9876543210', location: 'Delhi', appliedDate: '2025-10-01', experience: 4, idProof: 'ID123', skillsToTeach: ['Math', 'Science'] },
    { id: 't2', name: 'Arjun Mehta', email: 'arjun@example.com', phone: '9123456780', location: 'Mumbai', appliedDate: '2025-10-03', experience: 6, idProof: 'ID456', skillsToTeach: ['English', 'History'] },
    { id: 't3', name: 'Nisha Rao', email: 'nisha@example.com', phone: '9012345678', location: 'Bengaluru', appliedDate: '2025-10-05', experience: 3, idProof: 'ID789', skillsToTeach: ['Physics'] },
  ]
}

export default async function TeacherApprovalsPage() {
  const teachers = await fetchPendingTeachers()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-8 w-8 text-yellow-500" />
        <div>
          <h1 className="text-3xl font-bold">Teacher Approvals</h1>
          <p className="text-muted-foreground">Review and approve teacher applications</p>
        </div>
      </div>

      <ApprovalsStats pending={teachers.length} />

      <div className="space-y-4">
        {teachers.length === 0 ? (
          <div className="text-center py-12">
            <UserCheck className="h-16 w-16 text-chart-2 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
            <p className="text-muted-foreground">No pending teacher applications to review</p>
          </div>
        ) : (
          teachers.map((teacher) => (
            <RequestCard key={teacher.id} teacher={teacher} />
          ))
        )}
      </div>
    </div>
  )
}
