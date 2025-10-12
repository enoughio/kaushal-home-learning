"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AdminDataService, type TeacherApproval } from "@/lib/adminData";
import PendingApplications from "./PendingApplications";
import PendingApplicationsLoader from "./PendingApplicationsLoader";

export default function TeacherApprovalsClient() {
  const [teachers, setTeachers] = useState<TeacherApproval[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const laodTeacherApprovals = async () => {
      setLoading(true);
      try {
        const teachers = await AdminDataService.getPendingTeachers();
        setTeachers(teachers);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    laodTeacherApprovals();
  }, []);

  const statsSkeletonLoader = () => {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-center space-y-2">
              {/* Pulsing box for the number */}
              <div className="h-8 w-16 bg-gray-300 rounded-md mx-auto animate-pulse"></div>
              {/* Pulsing box for the label */}
              <div className="h-3 w-32 bg-gray-200 rounded-md mx-auto animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      {/* Stats */}
      {loading ? (
        statsSkeletonLoader()
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-500">
                  {teachers?.length}
                </p>
                <p className="text-muted-foreground">Pending Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Applications */}
      {loading ? (
        <PendingApplicationsLoader />
      ) : (
        <PendingApplications teachers={teachers} setTeachers={setTeachers} />
      )}
    </>
  );
}
