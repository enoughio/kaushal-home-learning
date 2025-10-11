"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Clock, AlertTriangle, User, Calendar } from "lucide-react";

interface PaymentsListProps {
  payments: any[];
  loading: boolean;
}

export default function PaymentsList({ payments, loading }: PaymentsListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "due":
        return "secondary";
      case "overdue":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <DollarSign className="h-4 w-4" />;
      case "due":
        return <Clock className="h-4 w-4" />;
      case "overdue":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-neutral-100 rounded-lg animate-pulse"
              >
                <div className="flex items-center space-x-4">
                  {/* Status icon skeleton */}
                  <div className="w-12 h-12 rounded-full bg-neutral-300"></div>

                  <div className="space-y-2">
                    {/* Subject */}
                    <div className="h-4 w-32 bg-neutral-300 rounded"></div>
                    {/* Student/Teacher/Due */}
                    <div className="h-3 w-48 bg-neutral-200 rounded"></div>
                  </div>
                </div>

                <div className="space-y-2 text-right">
                  {/* Amount */}
                  <div className="h-5 w-16 bg-neutral-300 rounded"></div>
                  {/* Badge */}
                  <div className="h-4 w-12 bg-neutral-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );

  if (payments.length === 0) {
    return (
      <div className="text-center py-8">
        <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No payment records found</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Records ({payments.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 bg-muted rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background">
                  {getStatusIcon(payment.status)}
                </div>
                <div>
                  <p className="font-medium">{payment.subject} Session</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {payment.studentName}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Teacher: {payment.teacherName}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Due: {payment.dueDate}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">
                  ₹{payment.amount.toLocaleString()}
                </p>
                <Badge variant={getStatusColor(payment.status)}>
                  {payment.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
