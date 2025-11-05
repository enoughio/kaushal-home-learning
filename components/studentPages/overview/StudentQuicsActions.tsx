import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, FileText } from "lucide-react";

export default async function StudentQuicsActions() {
  // Server-rendered quick actions. Replace placeholders with server data or user context later.
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/student/teachers">
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
              <BookOpen className="h-6 w-6" />
              <span>Find Teachers</span>
            </Button>
          </Link>

          <Link href="/student/attendance">
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
              <Calendar className="h-6 w-6" />
              <span>View Attendance Calendar</span>
            </Button>
          </Link>

          <Link href="/student/assignments">
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
              <FileText className="h-6 w-6" />
              <span>View Assignments</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}