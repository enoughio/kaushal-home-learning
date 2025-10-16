import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Phone, MapPin, Calendar, BookOpen, Award, UserCheck } from 'lucide-react'
import ApproveAction from './ApproveAction'
import RejectAction from './RejectAction'

type Teacher = {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  appliedDate?: string
  experience?: number
  idProof?: string
  skillsToTeach?: string[]
}

export default function RequestCard({ teacher }: { teacher: Teacher }) {
  return (
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
            {teacher.skillsToTeach?.map((skill) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
          <ApproveAction teacherId={teacher.id} />
          <RejectAction teacherId={teacher.id} />
        </div>
      </CardContent>
    </Card>
  )
}