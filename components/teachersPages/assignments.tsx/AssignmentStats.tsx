import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Star } from "lucide-react";

// Placeholder stats data
const assignedCount = 12;
const submittedCount = 8;
const gradedCount = 5;

const AssignmentStats = async () => {
  // Later: fetch stats from API here

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Assigned</p>
              <p className="text-2xl font-bold text-chart-2">{assignedCount}</p>
            </div>
            <FileText className="h-8 w-8 text-chart-2" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Submitted</p>
              <p className="text-2xl font-bold text-chart-1">{submittedCount}</p>
            </div>
            <FileText className="h-8 w-8 text-chart-1" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Graded</p>
              <p className="text-2xl font-bold text-chart-3">{gradedCount}</p>
            </div>
            <Star className="h-8 w-8 text-chart-3" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignmentStats;