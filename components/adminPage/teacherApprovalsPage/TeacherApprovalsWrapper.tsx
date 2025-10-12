import { AlertCircle } from "lucide-react";
import TeacherApprovalsClient from "./TeacherApprovalsClient";

export default function TeacherApprovalsWrapper() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <AlertCircle className="h-8 w-8 text-yellow-500" />
        <div>
          <h1 className="text-3xl font-bold">Teacher Approvals</h1>
          <p className="text-muted-foreground">
            Review and approve teacher applications
          </p>
        </div>
      </div>
      <TeacherApprovalsClient />
    </div>
  );
}
