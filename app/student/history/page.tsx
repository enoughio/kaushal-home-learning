"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MockDataService,
  type Assignment,
  type AttendanceRecord,
} from "@/lib/mockData";
import { AuthService } from "@/lib/auth";
import { Calendar, FileText, Clock, User, TrendingUp } from "lucide-react";

export default function HistoryPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const user = AuthService.getCurrentUser();
        if (user) {
          const [assignmentsData, attendanceData] = await Promise.all([
            MockDataService.getAssignments(user.id),
            MockDataService.getAttendanceRecords(user.id),
          ]);
          setAssignments(assignmentsData);
          setAttendance(attendanceData);
        }
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const completedAssignments = assignments.filter((a) => a.status === "graded");
  const averageGrade =
    completedAssignments.length > 0
      ? Math.round(
          completedAssignments.reduce((sum, a) => sum + (a.grade || 0), 0) /
            completedAssignments.length
        )
      : 0;
  const totalClasses = attendance.length;
  const presentClasses = attendance.filter(
    (a) => a.status === "present"
  ).length;
  const attendanceRate =
    totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Learning History</h1>
        <p className="text-muted-foreground">
          Review your academic progress and achievements
        </p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Average Grade
                </p>
                <p className="text-2xl font-bold text-chart-1">
                  {averageGrade}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-chart-1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Completed Assignments
                </p>
                <p className="text-2xl font-bold text-chart-2">
                  {completedAssignments.length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-chart-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Attendance Rate
                </p>
                <p className="text-2xl font-bold text-chart-3">
                  {attendanceRate}%
                </p>
              </div>
              <Calendar className="h-8 w-8 text-chart-3" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Classes
                </p>
                <p className="text-2xl font-bold text-chart-4">
                  {totalClasses}
                </p>
              </div>
              <Clock className="h-8 w-8 text-chart-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assignment History */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment History</CardTitle>
          </CardHeader>
          <CardContent>
            {completedAssignments.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No completed assignments yet
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {completedAssignments.map((assignment) => (
                  <div key={assignment.id} className="p-3 bg-muted rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {assignment.subject}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          {assignment.teacherName}
                          <Calendar className="h-3 w-3 ml-2" />
                          {assignment.submittedAt}
                        </div>
                      </div>
                      <Badge
                        variant={
                          assignment.grade && assignment.grade >= 80
                            ? "default"
                            : "secondary"
                        }
                      >
                        {assignment.grade}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...attendance.slice(0, 5), ...assignments.slice(0, 3)]
                .sort((a, b) => {
                  const dateA =
                    "date" in a ? a.date : a.submittedAt || a.dueDate;
                  const dateB =
                    "date" in b ? b.date : b.submittedAt || b.dueDate;
                  return new Date(dateB).getTime() - new Date(dateA).getTime();
                })
                .slice(0, 8)
                .map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-2 rounded-lg bg-muted"
                  >
                    {"status" in item && item.status === "present" ? (
                      <Calendar className="h-4 w-4 text-chart-2" />
                    ) : "status" in item && item.status === "absent" ? (
                      <Calendar className="h-4 w-4 text-destructive" />
                    ) : (
                      <FileText className="h-4 w-4 text-chart-1" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {"subject" in item
                          ? `${item.subject} Class`
                          : item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {"date" in item
                          ? item.date
                          : item.submittedAt || item.dueDate}
                      </p>
                    </div>
                    {"status" in item ? (
                      <Badge
                        variant={
                          item.status === "present" ? "default" : "destructive"
                        }
                        className="text-xs"
                      >
                        {item.status}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        {item.status}
                      </Badge>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
