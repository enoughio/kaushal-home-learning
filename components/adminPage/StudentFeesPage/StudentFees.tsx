"use client";

import { useEffect, useState } from "react";
import FeesTable from "./FeesTable";
import SummaryCards from "./SummaryCards";
import { AdminDataService, StudentFee } from "@/lib/adminData";

const StudentFeesWrapper = () => {
  const [fees, setFees] = useState<StudentFee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFees = async () => {
      try {
        const data = await AdminDataService.getStudentFees();
        setFees(data);
      } catch (error) {
        console.error("Failed to load student fees:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFees();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Student Fees</h1>
        <p className="text-muted-foreground">
          Monitor monthly fee collection and payment status
        </p>
      </div>

      {/* Summary Cards */}
      <SummaryCards fees={fees} loading={loading}/>

      {/* Fees Table */}
      <FeesTable fees={fees} setFees={setFees} loading={loading}/>
    </div>
  );
};

export default StudentFeesWrapper;
