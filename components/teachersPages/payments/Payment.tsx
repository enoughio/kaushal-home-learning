import React from 'react'


import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, User, Clock, Calendar } from "lucide-react";

// Dummy payments data for demonstration
const paymentsData = [
  {
    id: 1,
    studentName: "Amit Sharma",
    subject: "Maths",
    hoursTeached: 10,
    date: "2025-10-01",
    amount: 1200,
    status: "paid",
  },
  {
    id: 2,
    studentName: "Priya Singh",
    subject: "Science",
    hoursTeached: 8,
    date: "2025-09-28",
    amount: 1000,
    status: "pending",
  },
  {
    id: 3,
    studentName: "Rahul Verma",
    subject: "English",
    hoursTeached: 6,
    date: "2025-09-25",
    amount: 800,
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

type PaymentProps = {
  query?: string;
  status?: string;
};

const Payment = ({ query = "", status = "all" }: PaymentProps) => {
  // Filter payments by query and status
  const filteredPayments = paymentsData.filter((payment) => {
    const matchesQuery =
      !query ||
      payment.studentName.toLowerCase().includes(query.toLowerCase()) ||
      payment.subject.toLowerCase().includes(query.toLowerCase());
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
              {query || status !== "all"
                ? "No payments found matching your criteria"
                : "No payment records yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background">
                    <DollarSign className="h-6 w-6 text-chart-2" />
                  </div>
                  <div>
                    <p className="font-medium">{payment.studentName}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {payment.subject}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {payment.hoursTeached}h
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {payment.date}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">₹{payment.amount.toLocaleString()}</p>
                  <Badge variant={ getStatusColor(payment.status) }>{payment.status}</Badge>
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