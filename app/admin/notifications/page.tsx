"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminDataService, type NotificationStats } from "@/lib/adminData"
import { Mail, MessageSquare, Bell, AlertCircle, CheckCircle, Clock } from "lucide-react"

export default function NotificationsPage() {
  const [stats, setStats] = useState<NotificationStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await AdminDataService.getNotificationStats()
        setStats(data)
      } catch (error) {
        console.error("Failed to load notification stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading notification stats...</p>
          </div>
        </div>
    )
  }

  if (!stats) return null

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Notification System</h1>
          <p className="text-muted-foreground">Monitor automated notifications and communication</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Sent</p>
                  <p className="text-2xl font-bold">{stats.totalSent.toLocaleString()}</p>
                </div>
                <Bell className="h-8 w-8 text-chart-1" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email Notifications</p>
                  <p className="text-2xl font-bold">{stats.emailsSent}</p>
                </div>
                <Mail className="h-8 w-8 text-chart-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">WhatsApp Messages</p>
                  <p className="text-2xl font-bold">{stats.whatsappSent}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-chart-3" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">98.5%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-chart-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notification Types */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-chart-1" />
                Assignment Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-chart-1">{stats.assignmentReminders}</div>
                  <p className="text-sm text-muted-foreground">Notifications sent</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Due date reminders</span>
                    <span className="font-medium">{Math.round(stats.assignmentReminders * 0.6)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Overdue alerts</span>
                    <span className="font-medium">{Math.round(stats.assignmentReminders * 0.4)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-chart-2" />
                Payment Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-chart-2">{stats.paymentReminders}</div>
                  <p className="text-sm text-muted-foreground">Notifications sent</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Due date reminders</span>
                    <span className="font-medium">{Math.round(stats.paymentReminders * 0.7)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Grace period alerts</span>
                    <span className="font-medium">{Math.round(stats.paymentReminders * 0.3)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-chart-3" />
                Attendance Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-chart-3">{stats.attendanceAlerts}</div>
                  <p className="text-sm text-muted-foreground">Notifications sent</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Missing attendance</span>
                    <span className="font-medium">{Math.round(stats.attendanceAlerts * 0.8)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Low attendance warnings</span>
                    <span className="font-medium">{Math.round(stats.attendanceAlerts * 0.2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>Notification System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Email Service</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Service Status</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Delivery Rate</span>
                    <span className="text-sm font-medium">99.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Queue Status</span>
                    <span className="text-sm font-medium">12 pending</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">WhatsApp Service</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Service Status</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Delivery Rate</span>
                    <span className="text-sm font-medium">97.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Queue Status</span>
                    <span className="text-sm font-medium">8 pending</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Notice */}
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">System Configuration</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  The notification system is configured with fixed rules. WhatsApp and email notifications are mandatory
                  for all users. System behavior can only be modified through code changes, ensuring consistent
                  communication across the platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}
