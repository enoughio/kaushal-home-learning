import {
  UserCheck,
  UserX,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dispatch, SetStateAction, useState } from "react";
import { AdminDataService, TeacherApproval } from "@/lib/adminData";

type PendingApplicationsProps = {
  teachers: TeacherApproval[] | null;
  setTeachers: Dispatch<SetStateAction<TeacherApproval[] | null>>;
};

const PendingApplications = ({
  teachers,
  setTeachers,
}: PendingApplicationsProps) => {
  const [processing, setProcessing] = useState<string | null>(null);

  const handleApprove = async (teacherId: string) => {
    setProcessing(teacherId);
    try {
      await AdminDataService.approveTeacher(teacherId);
      setTeachers((prev) =>
        prev ? prev.filter((t) => t.id !== teacherId) : prev
      );
    } catch (error) {
      console.error("Failed to approve teacher:", error);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (teacherId: string) => {
    setProcessing(teacherId);
    try {
      await AdminDataService.rejectTeacher(teacherId);
      setTeachers((prev) =>
        prev ? prev.filter((t) => t.id !== teacherId) : prev
      );
    } catch (error) {
      console.error("Failed to reject teacher:", error);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-4">
      {teachers?.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <UserCheck className="h-16 w-16 text-chart-2 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
            <p className="text-muted-foreground">
              No pending teacher applications to review
            </p>
          </CardContent>
        </Card>
      ) : (
        teachers?.map((teacher) => (
          <Card key={teacher.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{teacher.name}</CardTitle>
                  <p className="text-muted-foreground">{teacher.email}</p>
                </div>
                <Badge variant="secondary">Pending Review</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{teacher.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{teacher.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Applied: {teacher.appliedDate}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{teacher.experience} years experience</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <UserCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>ID: {teacher.idProof}</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <div className="flex items-center mb-3">
                  <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">Teaching Subjects:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {teacher.skillsToTeach.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => handleReject(teacher.id)}
                  disabled={processing === teacher.id}
                  className="bg-transparent text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <UserX className="mr-2 h-4 w-4" />
                  {processing === teacher.id ? "Processing..." : "Reject"}
                </Button>
                <Button
                  onClick={() => handleApprove(teacher.id)}
                  disabled={processing === teacher.id}
                  className="bg-chart-2 hover:bg-chart-2/90"
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  {processing === teacher.id ? "Processing..." : "Approve"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default PendingApplications;
