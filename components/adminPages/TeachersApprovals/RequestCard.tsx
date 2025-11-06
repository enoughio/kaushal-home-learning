import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  UserCheck,
  FileText,
  GraduationCap,
} from "lucide-react";
import ApproveAction from "./ApproveAction";
import RejectAction from "./RejectAction";
import type { Teacher } from "@/lib/types";

export default function RequestCard({ teacher }: { teacher: Teacher }) {
  return (
    <Card key={teacher.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{teacher.name}</CardTitle>
            <p className="text-muted-foreground text-sm">{teacher.email}</p>
          </div>
          <Badge variant="secondary" className="ml-4">Pending Review</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Basic Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium text-xs text-muted-foreground">Phone:</span>
              <span className="ml-2">{teacher.phone || "N/A"}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium text-xs text-muted-foreground">Location:</span>
              <span className="ml-2">{teacher.location || "N/A"}</span>
            </div>

            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium text-xs text-muted-foreground">Pincode:</span>
              <span className="ml-2">{teacher.pincode || "N/A"}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <UserCheck className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium text-xs text-muted-foreground">Aadhar:</span>
              <span className="ml-2">{teacher.aadharURL ? "Verified" : "N/A"}</span>
            </div>

            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium text-xs text-muted-foreground">Applied:</span>
              <span className="ml-2">{new Date(teacher.appliedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Subjects Section */}
        <div>
          <div className="flex items-center mb-3">
            <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="font-medium">Teaching Subjects:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {teacher.subjects && teacher.subjects.length > 0 ? (
              teacher.subjects.map((subject) => (
                <Badge key={subject} variant="outline">
                  {subject}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">No subjects listed</span>
            )}
          </div>
        </div>

        {/* Qualifications Section */}
        <div>
          <div className="flex items-center mb-3">
            <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="font-medium">Qualifications:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium text-xs text-muted-foreground">Highest Qualification:</span>
                <p className="text-sm">{teacher.highestQualification || "N/A"}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium text-xs text-muted-foreground">10th Percentage:</span>
                <p className="text-sm">{teacher.tenthPercentage}%</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium text-xs text-muted-foreground">12th Percentage:</span>
                <p className="text-sm">{teacher.twelfthPercentage}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div>
          <div className="flex items-center mb-3">
            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="font-medium">Documents:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pl-6">
            <a
              href={teacher.aadharURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline flex items-center"
            >
              <FileText className="h-3 w-3 mr-1" />
              Aadhar
            </a>
            <a
              href={teacher.marksheetUrl10}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline flex items-center"
            >
              <FileText className="h-3 w-3 mr-1" />
              10th Marksheet
            </a>
            <a
              href={teacher.marksheetUrl12}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline flex items-center"
            >
              <FileText className="h-3 w-3 mr-1" />
              12th Marksheet
            </a>
            <a
              href={teacher.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline flex items-center"
            >
              <FileText className="h-3 w-3 mr-1" />
              Resume
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
          <ApproveAction teacherId={teacher.id} />
          <RejectAction teacherId={teacher.id} />
        </div>
      </CardContent>
    </Card>
  );
}
