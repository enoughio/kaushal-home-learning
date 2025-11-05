import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Upload, CheckCircle } from "lucide-react";

type Props = {
  pendingCount: number;
  submittedCount: number;
  gradedCount: number;
};

export default function AssignmentsStats({ pendingCount, submittedCount, gradedCount }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-destructive">{pendingCount}</p>
            </div>
            <FileText className="h-8 w-8 text-destructive" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Submitted</p>
              <p className="text-2xl font-bold text-chart-2">{submittedCount}</p>
            </div>
            <Upload className="h-8 w-8 text-chart-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Graded</p>
              <p className="text-2xl font-bold text-chart-1">{gradedCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-chart-1" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}