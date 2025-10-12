"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Clock, Bell } from "lucide-react";
import type { NotificationStats } from "@/lib/adminData";
import NotificationTypesSkeleton from "./ NotificationTypesSkeleton";

export default function NotificationTypes({
  stats,
  loading,
}: {
  stats: NotificationStats | null;
  loading: boolean;
}) {
  if (loading) return <NotificationTypesSkeleton />;

  const cards = [
    {
      title: "Assignment Reminders",
      icon: <AlertCircle className="h-5 w-5 text-chart-1" />,
      color: "text-chart-1",
      total: stats?.assignmentReminders ?? 0,
      breakdown: [
        [
          "Due date reminders",
          Math.round((stats?.assignmentReminders ?? 0) * 0.6),
        ],
        ["Overdue alerts", Math.round((stats?.assignmentReminders ?? 0) * 0.4)],
      ],
    },
    {
      title: "Payment Reminders",
      icon: <Clock className="h-5 w-5 text-chart-2" />,
      color: "text-chart-2",
      total: stats?.paymentReminders ?? 0,
      breakdown: [
        [
          "Due date reminders",
          Math.round((stats?.paymentReminders ?? 0) * 0.7),
        ],
        [
          "Grace period alerts",
          Math.round((stats?.paymentReminders ?? 0) * 0.3),
        ],
      ],
    },
    {
      title: "Attendance Alerts",
      icon: <Bell className="h-5 w-5 text-chart-3" />,
      color: "text-chart-3",
      total: stats?.attendanceAlerts ?? 0,
      breakdown: [
        [
          "Missing attendance",
          Math.round((stats?.attendanceAlerts ?? 0) * 0.8),
        ],
        [
          "Low attendance warnings",
          Math.round((stats?.attendanceAlerts ?? 0) * 0.2),
        ],
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {cards.map((c, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {c.icon}
              {c.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${c.color}`}>{c.total}</div>
                <p className="text-sm text-muted-foreground">
                  Notifications sent
                </p>
              </div>
              <div className="space-y-2">
                {c.breakdown.map(([label, val]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span>{label}</span>
                    <span className="font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
