"use client";

import React, { useState } from "react";
import { AttendanceStatus } from "@/generated/prisma";
import toast from "react-hot-toast";
async function mark(
  studentId: number,
  date: string,
  notes: string,
  position?: { latitude: number; longitude: number }
) {
  try {
    const response = await fetch(`/api/teacher/attendence/${studentId}/mark`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // ensure cookies (auth) are sent from client
      credentials: "same-origin",
      body: JSON.stringify({
        date,
        status: AttendanceStatus.PRESENT,
        location: position,
        notes,
      }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const message = payload?.message || payload?.error || response.statusText || "Failed to mark attendance";
      return { success: false, message, details: payload };
    }

    return { success: true, data: payload?.data ?? null };
  } catch (error) {
    return { success: false, message: (error instanceof Error && error.message) || String(error) };
  }
}

// helper: make geolocation promise-based
function getCurrentPositionAsync(options?: PositionOptions) {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

const MarkAttendance = ({
  student,
}: {
  student: { id: string; name: string; isMarkedToday: boolean };
}) => {
  const today = new Date().toISOString().split("T")[0];
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(today);
  const [checked, setChecked] = useState(false);
  // normalized position shape used by API
  const [position, setPosition] = useState<{ latitude: number; longitude: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMarked, setIsMarked] = useState<boolean>(student.isMarkedToday ?? false);

  const handleCheckbox = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setChecked(isChecked);

    if (isChecked) {
      try {
        const pos = await getCurrentPositionAsync({
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });

        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        console.log("Latitude:", lat);
        console.log("Longitude:", lon);
        // store normalized shape expected by API
        setPosition({ latitude: lat, longitude: lon });

        // alert(`Your location:\nLatitude: ${lat}\nLongitude: ${lon}`);
      } catch  {
        alert("Unable to fetch location: Please allow location access.");
      }
    } else {
      setPosition(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (isMarked) {
      setErrorMessage("Attendance already marked for today.");
      return;
    }

    if (!checked || !position) {
      setErrorMessage("Please confirm your location before marking attendance.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await mark(parseInt(student.id, 10), date, notes, position || undefined);
      if (result.success) {
        setSuccessMessage("Attendance marked successfully.");
        toast.success("Attendance marked successfully.");
        setIsMarked(true);
      } else {
        console.error("Mark error details:", result.details || result.message);
        const msg = result.message || "Failed to mark attendance.";
        setErrorMessage(msg);
        toast.error(msg);
      }
    } catch (err) {
      const em = (err instanceof Error && err.message) || String(err);
      setErrorMessage(em);
      toast.error(em);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-lg border bg-background p-4 space-y-3 ${isMarked ? "border-green-500 border-4 text-foreground" : "border-yellow-500 border-2"}`}
      aria-live="polite"
    >
      {/* Feedback messages */}
      {successMessage ? (
        <div className="rounded-md bg-green-50 p-2 text-sm text-green-800" role="status">
          {successMessage}
        </div>
      ) : null}
      {errorMessage ? (
        <div className="rounded-md bg-red-50 p-2 text-sm text-red-800" role="alert">
          {errorMessage}
        </div>
      ) : null}
      <div className="text-sm font-medium">Mark Attendance</div>
      <div className="text-xs text-muted-foreground mb-2">
        {student
          ? `Marking attendance for: ${student.name}`
          : "Select a student above"}
      </div>

      <label className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">Date</span>
        <input
          type="date"
          value={date}
          min={today}
          max={today}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        />
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={checked} onChange={handleCheckbox} />
        <span className="text-sm">
          I confirm I am physically at the student’s home for this session
        </span>
      </label>
      <label className="block">
        <div className="mb-1 text-sm text-muted-foreground">Notes (optional)</div>
        <textarea
          rows={3}
          disabled={isMarked}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={`w-full rounded-md border px-3 py-2 text-sm ${isMarked ? "bg-green text-muted-foreground" : "border-yellow-500 border-4 bg-gray-500 text-primary-foreground"}`}
          placeholder={isMarked ? "Today's topics are already submitted" : "Lesson topic, duration, or other remarks"}
          aria-disabled={isMarked}
        />
      </label>

      <button
        type="submit"
        disabled={isMarked || submitting}
        className={`w-full rounded-md border px-3 py-2 text-sm font-medium hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${isMarked ? "bg-green-400 text-foreground" : "border-yellow-500 border-4 bg-gray-500 text-primary-foreground"}`}
        aria-disabled={isMarked || submitting}
      >
        {submitting ? "Marking..." : isMarked ? "Already Marked" : "Mark Present"}
      </button>

      <p className="text-xs text-muted-foreground">
        Students/parents have a read-only view of this calendar in their
        dashboard.
      </p>
    </form>
  );
};

export default MarkAttendance;
