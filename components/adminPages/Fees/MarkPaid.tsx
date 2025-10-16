
"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const MarkPaid = ({ feeId }: { feeId: string }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleMarkPaid = async () => {
    setLoading(true);
    try {
      // Placeholder POST — replace with actual API route
      const res = await fetch(`/api/admin/fees/${feeId}/mark-paid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paidDate: new Date().toISOString().split("T")[0] }),
      });

      if (!res.ok) throw new Error("Failed to mark paid");

      // refresh server components on the page
      router.refresh();
    } catch (err) {
      console.error(err);
      // you might show a toast here
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button size="sm" onClick={handleMarkPaid} disabled={loading}>
      {loading ? "Marking..." : "Mark Paid"}
    </Button>
  );
};

export default MarkPaid;
