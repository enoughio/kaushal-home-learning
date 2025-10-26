"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

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

const PendingapprovalsOverView = () => {
  const [pendingTeachers, setPendingTeachers] = useState<PendingTeacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPendingTeachers()
  }, [])

  const fetchPendingTeachers = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/admin/approval-preview')
      const result: ApiResponse = await response.json()

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`)
      }

      if (result.data?.pendingTeachers) {
        setPendingTeachers(result.data.pendingTeachers)
      } else {
        throw new Error(result.message || 'Failed to fetch pending teachers')
      }
    } catch (error) {
      console.error("Error fetching pending teachers:", error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
      setPendingTeachers([])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />
            Pending Teacher Approvals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

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
            <Button onClick={fetchPendingTeachers} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
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
        {pendingTeachers.length === 0 ? (
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
  )
}

export default PendingapprovalsOverView