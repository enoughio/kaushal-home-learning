"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { type TeacherSalary } from "@/lib/adminData";
import { SalaryRow } from "./SalaryRow";
import { SalariesTableSkeleton } from "./SalariesTableSkeleton";

interface SalariesTableProps {
  salaries: TeacherSalary[];
  loading: boolean;
  updateSalary: (id: string, data: Partial<TeacherSalary>) => void;
}

export function SalariesTable({
  salaries,
  loading,
  updateSalary,
}: SalariesTableProps) {
  if (loading) return <SalariesTableSkeleton />;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Monthly Salaries</CardTitle>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add Salary Record
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {salaries.map((salary) => (
            <SalaryRow
              key={salary.id}
              salary={salary}
              onUpdate={updateSalary}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
