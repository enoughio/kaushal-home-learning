import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import myFetch from "@/lib/requestHelper";

interface AssignmentCountData {
  assigned: number;
  submitted: number;
  graded: number;
}

const fetchAssignmentStats = async (): Promise<AssignmentCountData | null> => {
  try {
    const response = await myFetch("/api/teacher/assignments");
    if (!response.ok) {
      console.error("Failed to fetch assignments:", response.status);
      return null;
    }

    const data = await response.json();
    const assignments = data.data || [];

    const stats = {
      assigned: assignments.filter(
        (a: { status: string }) => a.status === "ASSIGNED"
      ).length,
      submitted: assignments.filter(
        (a: { status: string }) => a.status === "SUBMITTED"
      ).length,
      graded: assignments.filter(
        (a: { status: string }) => a.status === "GRADED"
      ).length,
    };

    return stats;
  } catch (error) {
    console.error("Error fetching assignment stats:", error);
    return null;
  }
};

const AssignmentStats = async () => {
  const stats = await fetchAssignmentStats();

  if (!stats) {
    return (
      <Card>
        <CardContent className="flex items-center gap-2 py-6">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <p className="text-muted-foreground">Failed to load assignment statistics</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Assigned Count */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Assigned
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.assigned}
              </p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      {/* Submitted Count */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Submitted
              </p>
              <p className="text-2xl font-bold text-amber-600">
                {stats.submitted}
              </p>
            </div>
            <Clock className="h-8 w-8 text-amber-600" />
          </div>
        </CardContent>
      </Card>

      {/* Graded Count */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Graded
              </p>
              <p className="text-2xl font-bold text-green-600">
                {stats.graded}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignmentStats;