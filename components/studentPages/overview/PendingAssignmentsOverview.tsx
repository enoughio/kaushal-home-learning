import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Assignment, ApiResponse } from "@/lib/types";
import myFetch from "@/lib/requestHelper";

export default async function PendingAssignmentsOverview() {
  // Default placeholder — will be replaced by server API if available
  let pendingAssignments: Assignment[] = [
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
  ];

  try {
    const res = await myFetch("/api/student/(overview)/asi-ov");
    if (res.ok) {
      const json = (await res.json()) as ApiResponse<Array<{ id: number | string; title?: string; description?: string; subject?: string; teacherId?: string; teacherName?: string; dueDate?: string; status?: string }>>;
      if (json && Array.isArray(json.data)) {
        pendingAssignments = json.data.map((a) => ({
          id: String(a.id),
          title: a.title ?? "Untitled",
          description: a.description ?? "",
          subject: a.subject ?? "",
          teacherId: a.teacherId ?? "",
          teacherName: a.teacherName ?? "",
          dueDate: a.dueDate ?? null,
          status: (a.status && typeof a.status === "string") ? (a.status.toLowerCase() === "assigned" || a.status.toLowerCase() === "assigned" ? "pending" : a.status.toLowerCase()) : "pending",
        } as Assignment));
      }
    } else {
      console.error("PendingAssignmentsOverview: fetch failed", res.status);
    }
  } catch (err) {
    console.error("PendingAssignmentsOverview: error fetching assignments", err);
  }

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