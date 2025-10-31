import React from 'react'
import RequestCard from './RequestCard'

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
  // placeholder data
  return [
    { id: 't1', name: 'Sonia Kapoor', email: 'sonia@example.com', phone: '9876543210', location: 'Delhi', appliedDate: '2025-10-01', experience: 4, idProof: 'ID123', skillsToTeach: ['Math', 'Science'] },
    { id: 't2', name: 'Arjun Mehta', email: 'arjun@example.com', phone: '9123456780', location: 'Mumbai', appliedDate: '2025-10-03', experience: 6, idProof: 'ID456', skillsToTeach: ['English', 'History'] },
    { id: 't3', name: 'Nisha Rao', email: 'nisha@example.com', phone: '9012345678', location: 'Bengaluru', appliedDate: '2025-10-05', experience: 3, idProof: 'ID789', skillsToTeach: ['Physics'] },
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
