import React from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, UserCheck, DollarSign, TrendingUp } from 'lucide-react'

async function fetchPendingCount(): Promise<number> {
  // Placeholder - replace with real API call
  return 5
}

const QuickActionsAdmin = async () => {
  const pendingCount = await fetchPendingCount()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/admin/approvals" className="h-20">
            <Button variant="outline" className="h-20 w-full flex-col space-y-2 bg-transparent">
              <UserCheck className="h-6 w-6" />
              <span>Review Teachers</span>
              {pendingCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {pendingCount}
                </Badge>
              )}
            </Button>
          </Link>

          <Link href="/admin/users" className="h-20">
            <Button variant="outline" className="h-20 w-full flex-col space-y-2 bg-transparent">
              <Users className="h-6 w-6" />
              <span>Manage Users</span>
            </Button>
          </Link>

          <Link href="/admin/analytics" className="h-20">
            <Button variant="outline" className="h-20 w-full flex-col space-y-2 bg-transparent">
              <TrendingUp className="h-6 w-6" />
              <span>View Analytics</span>
            </Button>
          </Link>

          <Link href="/admin/payments" className="h-20">
            <Button variant="outline" className="h-20 w-full flex-col space-y-2 bg-transparent">
              <DollarSign className="h-6 w-6" />
              <span>Payment Overview</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default QuickActionsAdmin