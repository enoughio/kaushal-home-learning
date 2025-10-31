"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users } from "lucide-react";

import { AreaChart, Area, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Yearly data shape used by the AnnualGrowth page
interface YearlyData {
  year: string;
  revenue: number;
  students: number;
  teachers: number;
}

interface AnnualGrowthClientProps {
  initialData: YearlyData[];
}

export default function AnnualGrowthClient({ initialData }: AnnualGrowthClientProps) {
  const [annualData] = useState(initialData);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Annual Growth Trends</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" /> Annual Revenue Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={annualData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="year" className="text-muted-foreground" />
                <YAxis
                  className="text-muted-foreground"
                  tickFormatter={(value) => `₹${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> User Base Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={annualData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="year" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#82ca9d" />
                <Line type="monotone" dataKey="teachers" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}