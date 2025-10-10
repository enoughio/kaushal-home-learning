"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Clock, DollarSign, TrendingUp, Users } from "lucide-react";
import type { PlatformStats } from "@/lib/adminData";

interface KeyMetricsClientProps {
  stats: PlatformStats;
}

export function KeyMetricsClient({ stats }: KeyMetricsClientProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Monthly Growth
              </p>
              <p className="text-2xl font-bold text-chart-1">
                +{stats.monthlyGrowth}%
              </p>
              <p className="text-xs text-muted-foreground">User acquisition</p>
            </div>
            <TrendingUp className="h-8 w-8 text-chart-1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Yearly Growth
              </p>
              <p className="text-2xl font-bold text-chart-2">
                +{stats.yearlyGrowth}%
              </p>
              <p className="text-xs text-muted-foreground">Platform expansion</p>
            </div>
            <Users className="h-8 w-8 text-chart-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Annual Revenue
              </p>
              <p className="text-2xl font-bold text-chart-3">
                ₹{stats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Total platform revenue</p>
            </div>
            <DollarSign className="h-8 w-8 text-chart-3" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Attendance</p>
              <p className="text-2xl font-bold text-chart-4">90%</p>
              <p className="text-xs text-muted-foreground">Student attendance rate</p>
            </div>
            <Clock className="h-8 w-8 text-chart-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}