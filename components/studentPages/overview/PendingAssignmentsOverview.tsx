import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Assignment } from "@/lib/types";

export default async function PendingAssignmentsOverview() {
  // Placeholder assignments — replace with server fetch from API later
  const pendingAssignments: Assignment[] = [
    {
      id: "a1",
      title: "Algebra Worksheet",
      description: "Complete problems 1-20",
      subject: "Mathematics",
      teacherId: "t1",
      teacherName: "Ms. Parker",
      dueDate: "2025-10-15",
      status: "pending",
    },
    {
      id: "a2",
      title: "Science Lab Report",
      description: "Write up experiment results",
      subject: "Science",
      teacherId: "t2",
      teacherName: "Mr. Gomez",
      dueDate: "2025-10-18",
      status: "pending",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pending Assignments</CardTitle>
        <Link href="/student/assignments">
          <Button variant="ghost" size="sm">View All</Button>
        </Link>
      </CardHeader>
      <CardContent>
        {pendingAssignments.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No pending assignments</p>
        ) : (
          <div className="space-y-3">
            {pendingAssignments.slice(0, 3).map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{assignment.title}</p>
                  <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                  <p className="text-xs text-muted-foreground">Due: {assignment.dueDate}</p>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}