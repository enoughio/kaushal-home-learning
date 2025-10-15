import React from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle } from 'lucide-react'

type PendingTeacher = {
  id: string
  name: string
  skillsToTeach: string[]
  appliedDate: string
}

async function fetchPendingTeachers(): Promise<PendingTeacher[]> {
  // Placeholder - replace with API call
  return [
    { id: 't1', name: 'Sonal Verma', skillsToTeach: ['Math', 'Physics'], appliedDate: '2025-10-02' },
    { id: 't2', name: 'Vikram Rao', skillsToTeach: ['Chemistry'], appliedDate: '2025-10-04' },
  ]
}

const PendingapprovalsOverView = async () => {
  const pendingTeachers = await fetchPendingTeachers()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          Pending Teacher Approvals
        </CardTitle>
        <Link href="/admin/approvals">
          <Button variant="ghost" size="sm">View All</Button>
        </Link>
      </CardHeader>
      <CardContent>
        {pendingTeachers.length === 0 ? (
          <div className="text-center py-4">
            <CheckCircle className="h-8 w-8 text-chart-2 mx-auto mb-2" />
            <p className="text-muted-foreground">No pending approvals</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingTeachers.slice(0, 3).map((teacher) => (
              <div key={teacher.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{teacher.name}</p>
                  <p className="text-sm text-muted-foreground">{teacher.skillsToTeach.join(', ')}</p>
                  <p className="text-xs text-muted-foreground">Applied: {teacher.appliedDate}</p>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PendingapprovalsOverView