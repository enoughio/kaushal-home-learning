import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from "next/link";
import { User, Phone, MapPin, Calendar, BookOpen } from "lucide-react";

interface Student {
  id: number;
  name: string;
  age: number;
  status: string;
  phone: string;
  location: string;
  joinedDate: string;
  parentName?: string;
  parentPhone?: string;
  skillsLearning: string[];
}

const SearchList = ({
  filteredStudents,
  searchTerm,
}: {
  filteredStudents: Student[];
  searchTerm: string;
}) => {
  return (
    <div className="space-y-4">
      {filteredStudents.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchTerm ? "No students found matching your search" : "No students assigned yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">Age: {student.age}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      student.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {student.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 mr-2" />
                    {student.phone}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {student.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Joined: {student.joinedDate}
                  </div>
                </div>

                {/* Parent Info */}
                {student.parentName && (
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm font-medium">Parent/Guardian</p>
                    <p className="text-sm text-muted-foreground">{student.parentName}</p>
                    {student.parentPhone && <p className="text-sm text-muted-foreground">{student.parentPhone}</p>}
                  </div>
                )}

                {/* Subjects */}
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    Learning Subjects:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {student.skillsLearning.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2 border-t border-border">
                  <Link
                    href={`/teacher/students/${student.id}/progress`}
                    className="flex-1 px-2 py-1 text-sm rounded border bg-transparent text-center hover:underline"
                  >
                    View Progress
                  </Link>
                  <Link
                    href={`tel:${student.phone}`}
                    className="flex-1 px-2 py-1 text-sm rounded border bg-transparent text-center hover:underline"
                  >
                    Contact
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchList