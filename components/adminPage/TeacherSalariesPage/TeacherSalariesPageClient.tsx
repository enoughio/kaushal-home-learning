"use client";

import { useState, useEffect } from "react";
import { AdminDataService, type TeacherSalary } from "@/lib/adminData";
import { SummaryCards } from "./SummaryCards";
import { SalariesTable } from "./SalariesTable";

export default function TeacherSalariesPageClient() {
  const [salaries, setSalaries] = useState<TeacherSalary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const data = await AdminDataService.getTeacherSalaries();
        setSalaries(data);
      } catch (err) {
        console.error("Failed to load teacher salaries:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSalaries();
  }, []);

  const updateSalary = async (id: string, data: Partial<TeacherSalary>) => {
    try {
      await AdminDataService.updateTeacherSalary(id, data);
      setSalaries((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...data } : s))
      );
    } catch (err) {
      console.error("Failed to update salary:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Teacher Salaries</h1>
        <p className="text-muted-foreground">
          Manage monthly teacher compensation
        </p>
      </div>

      <SummaryCards salaries={salaries} loading={loading} />
      <SalariesTable
        salaries={salaries}
        loading={loading}
        updateSalary={updateSalary}
      />
    </div>
  );
}
