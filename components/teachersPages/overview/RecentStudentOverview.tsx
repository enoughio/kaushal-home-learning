import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import Link from "next/link";

// Placeholder data for active students
const activeStudents = [
  {
    id: 1,
    name: "John Doe",
    skillsLearning: ["Math", "Science"],
    joinedDate: "2024-06-01",
  },
  {
    id: 2,
    name: "Jane Smith",
    skillsLearning: ["English", "History"],
    joinedDate: "2024-05-15",
  },
  {
    id: 3,
    name: "Alice Johnson",
    skillsLearning: ["Art", "Music"],
    joinedDate: "2024-04-20",
  },
];

const RecentStudentOverview = () => {
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Students</CardTitle>
          <Link
            href="/teacher/students"
            className="px-2 py-1 text-sm rounded hover:underline"
          >
            View All
          </Link>
        </CardHeader>
        <CardContent>
          {activeStudents.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No active students
            </p>
          ) : (
            <div className="space-y-3">
              {activeStudents.slice(0, 3).map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {student.skillsLearning.join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Joined: {student.joinedDate}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentStudentOverview;
