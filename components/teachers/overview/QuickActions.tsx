import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import Link from 'next/link';
import { Calendar, DollarSign, FileText, Users } from 'lucide-react';

const QuickActions = () => {

  return (
    <div>
            <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link 
                href="/teacher/create-course"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              >
                <FileText className="h-6 w-6" />
                <span>Create Assignment</span>
              </Link>
              <Link href="/teacher/attendance"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              >
                <Calendar className="h-6 w-6" />
                <span>Mark Attendance</span>
              </Link>
              <Link
                href="/teacher/students"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              >
                <Users className="h-6 w-6" />
                <span>View Students</span>
              </Link>
              <Link href="/teacher/payments"
                className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              >
                <DollarSign className="h-6 w-6" />
                <span>Payment History</span>
              </Link>
            </div>
          </CardContent>
        </Card>

    </div>
  )
}

export default QuickActions