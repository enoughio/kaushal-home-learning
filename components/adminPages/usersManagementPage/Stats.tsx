"use client";

import { Card, CardContent } from "@/components/ui/card";
import { type UserManagement } from "@/lib/adminData";

interface StatsProps {
  users: UserManagement[];
  loading: boolean;
}

function Stats({ users, loading }: StatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 text-center">
              {/* Value skeleton: matches text-2xl font-bold */}
              <div className="h-8 w-20 mx-auto bg-neutral-200 rounded animate-pulse mb-2"></div>
              {/* Label skeleton: matches text-sm */}
              <div className="h-4 w-16 mx-auto bg-neutral-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const pendingUsers = users.filter((u) => u.status === "pending").length;
  const students = users.filter((u) => u.role === "student").length;
  const teachers = users.filter((u) => u.role === "teacher").length;

  const stats = [
    { label: "Total Users", value: totalUsers, color: "text-chart-1" },
    { label: "Active", value: activeUsers, color: "text-chart-2" },
    { label: "Pending", value: pendingUsers, color: "text-destructive" },
    { label: "Students", value: students, color: "text-chart-3" },
    { label: "Teachers", value: teachers, color: "text-chart-4" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default Stats;
