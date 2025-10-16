import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import MarkPaid from "./MarkPaid";
import SendReminder from "./SendReminder";
import FeesTablePagination from "./FeesTablePagination";

// Server component: fetches its own data (placeholder for now) and renders
type Fee = {
  id: string;
  studentName: string;
  studentId: string;
  monthlyFee: number;
  dueDate: string;
  gracePeriodEnd?: string | null;
  status: "paid" | "due" | "overdue" | "grace_period";
  paidDate?: string | null;
  remindersSent?: number;
};

async function fetchFees(): Promise<Fee[]> {
  // Placeholder data — replace with API fetch to `/api/admin/fees` later
  return [
    {
      id: "fee-1",
      studentName: "Asha Patel",
      studentId: "S1001",
      monthlyFee: 5000,
      dueDate: "2025-10-10",
      gracePeriodEnd: "2025-10-15",
      status: "paid",
      paidDate: "2025-10-09",
      remindersSent: 0,
    },
    {
      id: "fee-2",
      studentName: "Ravi Kumar",
      studentId: "S1002",
      monthlyFee: 4500,
      dueDate: "2025-10-10",
      gracePeriodEnd: null,
      status: "due",
      paidDate: null,
      remindersSent: 1,
    },
    {
      id: "fee-3",
      studentName: "Neha Singh",
      studentId: "S1003",
      monthlyFee: 5200,
      dueDate: "2025-09-10",
      gracePeriodEnd: null,
      status: "overdue",
      paidDate: null,
      remindersSent: 3,
    },
  ];
}

function getStatusColor(status: Fee["status"]) {
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
}

function getStatusIcon(status: Fee["status"]) {
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
}

export default async function FeesTable({ searchParams }: { searchParams?: { page?: string; pageSize?: string } }) {
  const fees = await fetchFees();

  // simple pagination using query params (page, pageSize)
  const page = Math.max(1, Number(searchParams?.page ?? 1));
  const pageSize = Math.max(1, Number(searchParams?.pageSize ?? 10));

  const totalItems = fees.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pagedFees = fees.slice(startIndex, endIndex);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Collection Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pagedFees.map((fee) => (
            <div key={fee.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1">
                <div>
                  <p className="font-medium">{fee.studentName}</p>
                  <p className="text-sm text-muted-foreground">Student ID: {fee.studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Fee</p>
                  <p className="font-bold">₹{fee.monthlyFee.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium">{fee.dueDate}</p>
                  {fee.gracePeriodEnd && <p className="text-xs text-muted-foreground">Grace: {fee.gracePeriodEnd}</p>}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={getStatusColor(fee.status)} className="flex items-center gap-1 w-fit">
                    {getStatusIcon(fee.status)}
                    {fee.status.replace("_", " ")}
                  </Badge>
                  {fee.paidDate && <p className="text-xs text-muted-foreground mt-1">Paid: {fee.paidDate}</p>}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reminders</p>
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{fee.remindersSent ?? 0}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {fee.status !== "paid" && (
                  // MarkPaid is a client component; pass feeId prop
                  // @ts-ignore Server -> Client
                  <MarkPaid feeId={fee.id} />
                )}
                {/* SendReminder is also client-side */}
                {/* @ts-ignore Server -> Client */}
                <SendReminder feeId={fee.id} />
              </div>
            </div>
          ))}

          {/* Pagination Controls - client component will update URL params */}
          {/* @ts-ignore Server -> Client */}
          <FeesTablePagination page={page} pageSize={pageSize} totalItems={totalItems} />
        </div>
      </CardContent>
    </Card>
  );
}
