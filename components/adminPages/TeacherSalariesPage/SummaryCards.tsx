"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { type TeacherSalary } from "@/lib/adminData";

interface SummaryCardsProps {
  salaries: TeacherSalary[];
  loading: boolean;
}

export function SummaryCards({ salaries, loading }: SummaryCardsProps) {
  if (loading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse"></div>
                  <div className="h-8 w-20 bg-neutral-300 rounded animate-pulse"></div>
                </div>
                <div className="h-8 w-8 bg-neutral-200 rounded-full animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );

  const totalPaid = salaries
    .filter((s) => s.status === "paid")
    .reduce((sum, s) => sum + s.totalSalary, 0);
  const totalPending = salaries
    .filter((s) => s.status === "pending")
    .reduce((sum, s) => sum + s.totalSalary, 0);
  const activeTeachers = new Set(salaries.map((s) => s.teacherId)).size;

  const cards = [
    { label: "Total Paid", value: totalPaid, iconColor: "text-chart-1" },
    {
      label: "Pending Payments",
      value: totalPending,
      iconColor: "text-chart-2",
    },
    {
      label: "Active Teachers",
      value: activeTeachers,
      iconColor: "text-chart-3",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </p>
                <p className="text-2xl font-bold">
                  {card.value.toLocaleString?.() ?? card.value}
                </p>
              </div>
              <DollarSign className={`h-8 w-8 ${card.iconColor}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
