import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from "next/link";
import { User, Phone, MapPin, Calendar, BookOpen, AlertTriangle } from "lucide-react";

interface Student {
  id: number;
  name: string;
  age: number | null;
  status: string;
  phone: string;
  location: string;
  joinedDate: string;
  parentName?: string;
  parentPhone?: string;
  skillsLearning: string[];
}

interface SearchListProps {
  filteredStudents: Student[];
  searchTerm: string;
}

const SearchList = ({ filteredStudents, searchTerm }: SearchListProps) => {
  return (
    <div className="space-y-4">
      {filteredStudents.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchTerm ? "No students found matching your search" : "No students assigned yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="text-sm text-muted-foreground mb-4">
            Found {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                      {student.age && (
                        <p className="text-sm text-muted-foreground">Age: {student.age}</p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
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
                    {student.phone && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 mr-2" />
                        {student.phone}
                      </div>
                    )}
                    {student.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {student.location}
                      </div>
                    )}
                    {student.joinedDate && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        Joined: {new Date(student.joinedDate).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                      </div>
                    )}
                  </div>

                  {/* Parent Info */}
                  {student.parentName && (
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm font-medium">Parent/Guardian</p>
                      <p className="text-sm text-muted-foreground">{student.parentName}</p>
                      {student.parentPhone && (
                        <p className="text-sm text-muted-foreground">{student.parentPhone}</p>
                      )}
                    </div>
                  )}

                  {/* Subjects */}
                  {student.skillsLearning && student.skillsLearning.length > 0 && (
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
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2 border-t border-border">
            
                    {student.phone && (
                      <Link
                        href={`tel:${student.phone}`}
                        className="flex-1 px-2 py-1 text-sm rounded border bg-transparent text-center hover:underline text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Contact
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default SearchList