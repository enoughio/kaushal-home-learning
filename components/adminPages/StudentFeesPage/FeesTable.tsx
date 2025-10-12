"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";
import { AdminDataService, StudentFee } from "@/lib/adminData";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import FeesTableSkeletonLoader from "./FeesTableSkeletonLoader";

interface FeesTableProps {
  fees: StudentFee[];
  setFees: React.Dispatch<React.SetStateAction<StudentFee[]>>;
  loading: boolean;
}

const FeesTable = ({ fees, setFees, loading }: FeesTableProps) => {
  const handleMarkPaid = async (feeId: string) => {
    try {
      await AdminDataService.updateStudentFeeStatus(
        feeId,
        "paid",
        new Date().toISOString().split("T")[0]
      );
      setFees((prev) =>
        prev.map((f) =>
          f.id === feeId
            ? {
                ...f,
                status: "paid",
                paidDate: new Date().toISOString().split("T")[0],
              }
            : f
        )
      );
    } catch (error) {
      console.error("Failed to update fee status:", error);
    }
  };

  const getStatusColor = (status: StudentFee["status"]) => {
    switch (status) {
      case "paid":
        return "default";
      case "due":
        return "secondary";
      case "overdue":
        return "destructive";
      case "grace_period":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: StudentFee["status"]) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4" />;
      case "due":
        return <Clock className="h-4 w-4" />;
      case "overdue":
        return <AlertTriangle className="h-4 w-4" />;
      case "grace_period":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <FeesTableSkeletonLoader rows={3}/>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Collection Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fees.map((fee) => (
            <div
              key={fee.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1">
                <div>
                  <p className="font-medium">{fee.studentName}</p>
                  <p className="text-sm text-muted-foreground">
                    Student ID: {fee.studentId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Fee</p>
                  <p className="font-bold">
                    ₹{fee.monthlyFee.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium">{fee.dueDate}</p>
                  {fee.gracePeriodEnd && (
                    <p className="text-xs text-muted-foreground">
                      Grace: {fee.gracePeriodEnd}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant={getStatusColor(fee.status)}
                    className="flex items-center gap-1 w-fit"
                  >
                    {getStatusIcon(fee.status)}
                    {fee.status.replace("_", " ")}
                  </Badge>
                  {fee.paidDate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Paid: {fee.paidDate}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reminders</p>
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{fee.remindersSent}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {fee.status !== "paid" && (
                  <Button size="sm" onClick={() => handleMarkPaid(fee.id)}>
                    Mark Paid
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  Send Reminder
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeesTable;
