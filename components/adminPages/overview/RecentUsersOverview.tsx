import React from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type RecentUser = {
  id: string
  name: string
  email: string
  joinedDate: string
  role: string
  status: 'active' | 'inactive' | 'pending'
}

async function fetchRecentUsers(): Promise<RecentUser[]> {
  // Placeholder data - replace with API call later
  return [
    { id: '1', name: 'Aisha Kumar', email: 'aisha@example.com', joinedDate: '2025-09-28', role: 'student', status: 'active' },
    { id: '2', name: 'Rahul Singh', email: 'rahul@example.com', joinedDate: '2025-10-01', role: 'teacher', status: 'active' },
    { id: '3', name: 'Meera Patel', email: 'meera@example.com', joinedDate: '2025-10-05', role: 'student', status: 'inactive' },
  ]
}

const RecentUsersOverview = async () => {
  const recentUsers = await fetchRecentUsers()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Users</CardTitle>
        <Link href="/admin/users">
          <Button variant="ghost" size="sm">View All</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground">Joined: {user.joinedDate}</p>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="mb-1">{user.role}</Badge>
                <br />
                <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>{user.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentUsersOverview