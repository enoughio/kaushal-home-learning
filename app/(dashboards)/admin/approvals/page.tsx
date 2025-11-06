import React from "react";
import { AlertCircle, UserCheck } from "lucide-react";
import RequestCard from "@/components/adminPages/TeachersApprovals/RequestCard";
import ApprovalsStats from "@/components/adminPages/TeachersApprovals/ApprovalsStats";
import myFetch from "@/lib/requestHelper";
import { Teacher } from "@/lib/types";



async function fetchPendingTeachers(): Promise<Teacher[]> {
  try {
  

    const response = await myFetch(`/api/admin/approvals`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch pending teachers");
    }

    if (result.data?.pendingTeachers) {
      return result.data?.pendingTeachers;
    } else {
      throw new Error(result.message || "No pending teachers data found");
    }
  } catch (error) {
    console.error("Failed to fetch pending teachers:", error);
    return [];
  }
}

export default async function TeacherApprovalsPage() {
  const teachers = await fetchPendingTeachers();

  return (
    <div className="space-y-6 pb-[25vh]">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-8 w-8 text-yellow-500" />
        <div>
          <h1 className="text-3xl font-bold">Teacher Approvals</h1>
          <p className="text-muted-foreground">
            Review and approve teacher applications
          </p>
        </div>
      </div>

      <ApprovalsStats pending={teachers.length} />

      <div className="space-y-4">
        {teachers.length === 0 ? (
          <div className="text-center py-12">
            <UserCheck className="h-16 w-16 text-chart-2 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
            <p className="text-muted-foreground">
              No pending teacher applications to review
            </p>{" "}
          </div>
        ) : (
          teachers.map((teacher) => (
            <RequestCard key={teacher.id} teacher={teacher} />
          ))
        )}
      </div>
    </div>
  );
}
