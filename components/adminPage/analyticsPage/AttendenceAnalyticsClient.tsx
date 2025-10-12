"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AttendenceAnalyticsClientProps {
  data: { month: string; attendance: number }[];
}

export function AttendenceAnalyticsClient({ data }: AttendenceAnalyticsClientProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Attendance Analytics</h2>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Monthly Attendance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-muted-foreground" />
              <YAxis className="text-muted-foreground" domain={[80, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value) => [`${value}%`, "Attendance"]}
              />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="hsl(var(--chart-4))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--chart-4))", strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}