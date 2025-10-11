"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Clock, AlertTriangle } from "lucide-react";

interface PaymentStatsProps {
  payments: any[];
  loading: boolean;
}

export default function PaymentStats({ payments, loading }: PaymentStatsProps) {
  if (loading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-2">
                {/* Label skeleton, matching text-sm height */}
                <div className="h-4 w-24 bg-neutral-300 rounded animate-pulse"></div>
                {/* Amount skeleton, matching text-2xl height */}
                <div className="h-8 w-20 bg-neutral-400 rounded animate-pulse"></div>
              </div>
              {/* Icon skeleton, same as actual h-8 w-8 */}
              <div className="h-8 w-8 bg-neutral-300 rounded-full animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const dueAmount = payments
    .filter((p) => p.status === "due")
    .reduce((sum, p) => sum + p.amount, 0);
  const overdueAmount = payments
    .filter((p) => p.status === "overdue")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Amount
            </p>
            <p className="text-2xl font-bold">
              ₹{totalAmount.toLocaleString()}
            </p>
          </div>
          <DollarSign className="h-8 w-8 text-chart-1" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Paid</p>
            <p className="text-2xl font-bold text-chart-2">
              ₹{paidAmount.toLocaleString()}
            </p>
          </div>
          <DollarSign className="h-8 w-8 text-chart-2" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Due</p>
            <p className="text-2xl font-bold text-chart-3">
              ₹{dueAmount.toLocaleString()}
            </p>
          </div>
          <Clock className="h-8 w-8 text-chart-3" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Overdue</p>
            <p className="text-2xl font-bold text-destructive">
              ₹{overdueAmount.toLocaleString()}
            </p>
          </div>
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </CardContent>
      </Card>
    </div>
  );
}
