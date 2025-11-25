import React from 'react'


import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, User } from "lucide-react";

// Default dummy payments (fallback)
const paymentsFallback = [
  {
    id: 1,
    month: "Oct",
    totalSalary: 1200,
    paidDate: "2025-10-01",
    status: "paid",
  },
  {
    id: 2,
    month: "Sep",
    totalSalary: 1000,
    paidDate: "2025-09-28",
    status: "pending",
  },
  {
    id: 3,
    month: "Sep",
    totalSalary: 800,
    paidDate: "2025-09-25",
    status: "overdue",
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "paid":
      return "default";
    case "pending":
      return "secondary";
    case "overdue":
      return "destructive";
    default:
      return "outline";
  }
}

type SalaryRecord = {
  month: string;
  totalSalary: number;
  paidDate: string;
  status: string;
  id?: number | string;
};

type PaymentProps = {
  payments?: SalaryRecord[];
  query?: string;
  status?: string;
};

const Payment: React.FC<PaymentProps> = ({ payments, query = "", status = "all" }) => {
  const source: SalaryRecord[] = Array.isArray(payments) && payments.length > 0 ? payments : paymentsFallback;

  // Filter payments by query and status. Query may match month or paidDate.
  const filteredPayments = source.filter((payment) => {
    const monthStr = (payment.month || "") as string;
    const paidDateStr = (payment.paidDate || "") as string;
    const matchesQuery = !query || monthStr.toLowerCase().includes(query.toLowerCase()) || paidDateStr.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "all" || payment.status === status;
    return matchesQuery && matchesStatus;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Records</CardTitle>
      </CardHeader>
      <CardContent>
        {filteredPayments.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {query || status !== "all" ? "No payments found matching your criteria" : "No payment records yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPayments.map((payment, idx) => (
              <div key={payment.id ?? idx} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background">
                    <DollarSign className="h-6 w-6 text-chart-2" />
                  </div>
                  <div>
                    <p className="font-medium">{payment.month}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{payment.paidDate ? new Date(payment.paidDate).toLocaleDateString("en-IN") : "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">₹{(payment.totalSalary || 0).toLocaleString()}</p>
                  <Badge variant={getStatusColor(payment.status)}>{payment.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Payment;