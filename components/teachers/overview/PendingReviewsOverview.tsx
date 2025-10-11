import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import Link from "next/link";

// Placeholder data for pending assignments
const pendingAssignments = [
  {
    id: 1,
    title: "Math Homework",
    studentName: "John Doe",
    dueDate: "2024-06-10",
  },
  {
    id: 2,
    title: "Science Project",
    studentName: "Jane Smith",
    dueDate: "2024-06-12",
  },
  {
    id: 3,
    title: "History Essay",
    studentName: "Alice Johnson",
    dueDate: "2024-06-15",
  },
];

const PendingReviewsOverview = () => {
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pending Reviews</CardTitle>
          <Link
            href="/teacher/assignments"
            className="px-2 py-1 text-sm rounded hover:underline"
          >
            View All
          </Link>
        </CardHeader>
        <CardContent>
          {pendingAssignments.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No assignments to review</p>
          ) : (
            <div className="space-y-3">
              {pendingAssignments.slice(0, 3).map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{assignment.title}</p>
                    <p className="text-sm text-muted-foreground">{assignment.studentName}</p>
                    <p className="text-xs text-muted-foreground">Due: {assignment.dueDate}</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                    Review
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PendingReviewsOverview