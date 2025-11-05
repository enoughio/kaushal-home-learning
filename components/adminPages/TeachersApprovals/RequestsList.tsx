import React from 'react'
import RequestCard from './RequestCard'
import type { Teacher } from '@/lib/types'


async function fetchPendingTeachers(): Promise<Teacher[]> {
  // placeholder data
  return [
    { id: 't1', name: 'Sonia Kapoor', email: 'sonia@example.com', phone: '9876543210', location: 'Delhi', appliedAt: '2025-10-01', experience: 4, idProof: 'ID123', subjects: ['Math', 'Science'] },
    { id: 't2', name: 'Arjun Mehta', email: 'arjun@example.com', phone: '9123456780', location: 'Mumbai', appliedAt: '2025-10-03', experience: 6, idProof: 'ID456', subjects: ['English', 'History'] },
    { id: 't3', name: 'Nisha Rao', email: 'nisha@example.com', phone: '9012345678', location: 'Bengaluru', appliedAt: '2025-10-05', experience: 3, idProof: 'ID789', subjects: ['Physics'] },
  ]
}

export default async function RequestsList() {
  const teachers = await fetchPendingTeachers()

  if (teachers.length === 0) {
    return (
      <div />
    )
  }

  return (
    <div className="space-y-4">
      {teachers.map(teacher => (
        <RequestCard key={teacher.id} teacher={teacher} />
      ))}
    </div>
  )
}
