import React from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cookies } from 'next/headers'
import { RecentUser } from '@/lib/types'

async function fetchRecentUsers(): Promise<RecentUser[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token");
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/admin/dashboard/recent-users`, {
      headers: {
        "authorization": `Bearer ${token?.value}` || "",
      },
    });
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message);
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching recent users:", error);
    // Fallback to empty array
    return [];
  }
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
          {recentUsers.length > 0 ? recentUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="mb-1">{user.role}</Badge>
                <br />
                <Badge variant={user.isActive ? 'default' : 'secondary'}>{user.isActive ? 'active' : 'inactive'}</Badge>
              </div>
            </div>
          )) : (
            <p className="text-muted-foreground text-center py-4">No recent users found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentUsersOverview