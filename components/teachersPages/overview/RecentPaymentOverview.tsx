import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import Link from "next/link";
import { DollarSign } from "lucide-react";

// Placeholder data for payments
const payments = [
  {
    id: 1,
    studentName: "John Doe",
    subject: "Math",
    hoursTeached: 2,
    date: "2024-06-01",
    amount: 500,
    status: "paid",
  },
  {
    id: 2,
    studentName: "Jane Smith",
    subject: "Science",
    hoursTeached: 1,
    date: "2024-06-03",
    amount: 300,
    status: "pending",
  },
  {
    id: 3,
    studentName: "Alice Johnson",
    subject: "English",
    hoursTeached: 1.5,
    date: "2024-06-05",
    amount: 400,
    status: "failed",
  },
  {
    id: 4,
    studentName: "Bob Brown",
    subject: "History",
    hoursTeached: 2,
    date: "2024-06-07",
    amount: 600,
    status: "paid",
  },
  {
    id: 5,
    studentName: "Charlie Green",
    subject: "Art",
    hoursTeached: 1,
    date: "2024-06-09",
    amount: 350,
    status: "pending",
  },
];

const RecentPaymentOverview = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Payments</CardTitle>
        <Link
          href="/teacher/payments"
          className="px-2 py-1 text-sm rounded hover:underline"
        >
          View All
        </Link>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No payment records</p>
        ) : (
          <div className="space-y-3">
            {payments.slice(0, 5).map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background">
                    <DollarSign className="h-5 w-5 text-chart-2" />
                  </div>
                  <div>
                    <p className="font-medium">{payment.studentName}</p>
                    <p className="text-sm text-muted-foreground">
                      {payment.subject} • {payment.hoursTeached}h
                    </p>
                    <p className="text-xs text-muted-foreground">{payment.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{payment.amount}</p>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      payment.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : payment.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default RecentPaymentOverview