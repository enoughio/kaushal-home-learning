"use client";

import { useState, useEffect } from "react";
import { AdminDataService, type NotificationStats } from "@/lib/adminData";
import OverviewCards from "./OverviewCards";
import NotificationTypes from "./NotificationTypes";
import SystemStatus from "./SystemStatus";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotificationsPageClient() {
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await AdminDataService.getNotificationStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load notification stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notification System</h1>
        <p className="text-muted-foreground">
          Monitor automated notifications and communication
        </p>
      </div>

      <OverviewCards stats={stats} loading={loading} />
      <NotificationTypes stats={stats} loading={loading} />
      <SystemStatus loading={loading} />

      {/* Configuration Notice */}
      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                System Configuration
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                The notification system is configured with fixed rules. WhatsApp
                and email notifications are mandatory for all users. System
                behavior can only be modified through code changes, ensuring
                consistent communication across the platform.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
