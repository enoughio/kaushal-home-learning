

"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const SendReminder = ({ feeId }: { feeId: string }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSend = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/fees/${feeId}/send-reminder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Please pay your pending fees" }),
      });
      if (!res.ok) throw new Error("Failed to send reminder");
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button size="sm" variant="outline" onClick={handleSend} disabled={loading}>
      {loading ? "Sending..." : "Send Reminder"}
    </Button>
  );
};

export default SendReminder;