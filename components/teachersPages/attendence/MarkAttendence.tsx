"use client";

import React, { useState } from "react";
import { AttendanceStatus } from "@/generated/prisma";

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
      body: JSON.stringify({
        date,
        status: AttendanceStatus.PRESENT,
        location: position,
        notes,
      }),
    });

    if (!response.ok) throw new Error("Failed to mark attendance");
    console.log("Attendance marked successfully");
  } catch (error) {
    console.error("Error marking attendance:", error);
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

const MarkAttendance = (
  {
    student,
  }: {
    student: { id: string; name: string };
  },
  isMarkedToday: boolean
) => {
  const today = new Date().toISOString().split("T")[0];
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(today);
  const [checked, setChecked] = useState(false);
  const [marked, setMarked] = useState(isMarkedToday);
  const [position, setPosition] = useState<{ lat: number; lon: number } | null>(
    null
  );

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
        setPosition({ lat, lon });

        // alert(`Your location:\nLatitude: ${lat}\nLongitude: ${lon}`);
      } catch (error: any) {
        alert("Unable to fetch location: " + error.message);
      }
    } else {
      setPosition(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!checked || !position) {
      alert("Please confirm your location before marking attendance.");
      return;
    }

    console.log("Submitting attendance with coordinates:", position);
    await mark(parseInt(student.id), date, notes, {
      latitude: position.lat,
      longitude: position.lon,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border bg-background p-4 space-y-3"
    >
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
        <div className="mb-1 text-sm text-muted-foreground">
          Notes (optional)
        </div>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          placeholder="Lesson topic, duration, or other remarks"
        />
      </label>

      <button
        type="submit"
        disabled={marked}
        className="w-full rounded-md border bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Mark Present
      </button>

      <p className="text-xs text-muted-foreground">
        Students/parents have a read-only view of this calendar in their
        dashboard.
      </p>
    </form>
  );
};

export default MarkAttendance;
