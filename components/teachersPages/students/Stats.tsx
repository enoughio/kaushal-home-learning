import { Card, CardContent } from '@/components/ui/card';
import React from 'react'


interface Student {
  id: number;
  status: string;
  // ...other fields
}

const Stats = ({ students }: { students: Student[] }) => {
  const activeStudents = students.filter(s => s.status === "active");
  const inactiveStudents = students.filter(s => s.status !== "active");

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-1">{activeStudents.length}</p>
            <p className="text-sm text-muted-foreground">Active Students</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-muted-foreground">{inactiveStudents.length}</p>
            <p className="text-sm text-muted-foreground">Inactive Students</p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default Stats