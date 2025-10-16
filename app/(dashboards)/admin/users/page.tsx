import React, { Suspense } from 'react'
import UserManagmentStats from '@/components/adminPages/userManag/UserManagmentStats'
import UserFilters from '@/components/adminPages/userManag/UserFilters'
import UserList from '@/components/adminPages/userManag/UserList'
import { Card } from '@/components/ui/card'

type User = {
  id: string
  name: string
  email: string
  joinedDate: string
  lastActive: string
  role: string
  status: string
}

async function fetchUsersPlaceholder(): Promise<User[]> {
  return [
    { id: '1', name: 'Aisha Kumar', email: 'aisha@example.com', joinedDate: '2025-09-28', lastActive: '2025-10-10', role: 'student', status: 'active' },
    { id: '2', name: 'Rahul Singh', email: 'rahul@example.com', joinedDate: '2025-10-01', lastActive: '2025-10-11', role: 'teacher', status: 'pending' },
    { id: '3', name: 'Meera Patel', email: 'meera@example.com', joinedDate: '2025-10-05', lastActive: '2025-10-12', role: 'student', status: 'inactive' },
  ]
}

function StatsFallback() {
  return (
    <div className="animate-pulse">
      <Card className="h-24" />
    </div>
  )
}



function ListFallback() {
  return (
    <div className="space-y-2">
      <Card className="h-20" />
      <Card className="h-20" />
    </div>
  )
}

export default async function UserManagementPage({ searchParams }: { searchParams?: Record<string, string> | URLSearchParams | any }) {
  const params = (searchParams as any) ?? {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage all platform users and their access</p>
      </div>

      <Suspense fallback={<StatsFallback />}>
        {/* server component: will fetch its own data */}
        <UserManagmentStats />
      </Suspense>

      <Suspense fallback={<ListFallback />}>
        {/* server component: fetches based on searchParams */}
        <UserList searchParams={params} />
      </Suspense>
    </div>
  )
}
