import React from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'

interface PendingTeacher {
  tempUserId: number;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  createdAt: Date;
  qualification: string | null;
  experienceYears: number | null;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: {
    pendingTeachers: PendingTeacher[];
  };
  error?: {
    code: string;
    message: string;
  };
}

async function fetchPendingTeachers(): Promise<{ data: PendingTeacher[] | null; error: string | null }> {
  try {
    // For server components, we need to handle authentication differently
    // The API route will handle authentication via middleware
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/approval-preview`,
      {
        cache: 'no-store', // Ensure fresh data
        headers: {
          'Content-Type': 'application/json',
          // Note: Cookies are automatically included in server-side fetches in Next.js
        },
      }
    );

    if (!response.ok) {
      // Handle specific HTTP status codes
      if (response.status === 401) {
        return {
          data: null,
          error: 'Authentication required. Please log in again.'
        };
      } else if (response.status === 403) {
        return {
          data: null,
          error: 'Access denied. Admin privileges required.'
        };
      } else {
        return {
          data: null,
          error: `HTTP error! status: ${response.status}`
        };
      }
    }

    const result: ApiResponse = await response.json();

    if (result.success && result.data?.pendingTeachers) {
      return {
        data: result.data.pendingTeachers,
        error: null
      };
    } else {
      return {
        data: null,
        error: result.message || 'Failed to fetch pending teachers'
      };
    }
  } catch (error) {
    console.error("Error fetching pending teachers:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

const PendingapprovalsOverView = async () => {
  const { data: pendingTeachers, error } = await fetchPendingTeachers();

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Pending Teacher Approvals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              {error.includes('Authentication') || error.includes('Access denied')
                ? 'Please ensure you are logged in as an administrator.'
                : 'Please refresh the page or contact support if the problem persists.'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
        {!pendingTeachers || pendingTeachers.length === 0 ? (
          <div className="text-center py-4">
            <CheckCircle className="h-8 w-8 text-chart-2 mx-auto mb-2" />
            <p className="text-muted-foreground">No pending approvals</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingTeachers.slice(0, 3).map((teacher) => (
              <div key={teacher.tempUserId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{teacher.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {teacher.qualification && `${teacher.qualification}`}
                    {teacher.experienceYears && ` • ${teacher.experienceYears} years exp`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Applied: {new Date(teacher.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingapprovalsOverView;