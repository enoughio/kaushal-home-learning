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

const MarkAttendance = ({
  student,
}: {
  student: { id: string; name: string; isMarkedToday: boolean };
}) => {
  const today = new Date().toISOString().split("T")[0];
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(today);
  const [checked, setChecked] = useState(false);
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
      } catch (error: InstanceType<typeof Error> | any) {
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
      className={`rounded-lg border bg-background p-4 space-y-3 ${ student.isMarkedToday
            ? "border-green-500 border-4 text-foreground"
            : "border-yellow-500 border-2 "
        }`}
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
          disabled={student.isMarkedToday}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={`w-full rounded-md border px-3 py-2 text-sm ${
            student.isMarkedToday
              ? "bg-green text-muted-foreground"
              : "border-yellow-500 border-4  bg-gray-500 text-primary-foreground"
          }`}
          placeholder={
            student.isMarkedToday
              ? "Today's topics are already submitted"
              : "Lesson topic, duration, or other remarks"
          }
          aria-disabled={student.isMarkedToday}
        />
      </label>

      <button
        type="submit"
        disabled={student.isMarkedToday}
        className={`w-full rounded-md border px-3 py-2 text-sm font-medium hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${
          student.isMarkedToday
            ? "bg-green-400 text-foreground"
            : "border-yellow-500 border-4  bg-gray-500 text-primary-foreground"
        }`}
        aria-disabled={student.isMarkedToday}
      >
        {student.isMarkedToday ? "Already Marked" : "Mark Present"}
      </button>

      <p className="text-xs text-muted-foreground">
        Students/parents have a read-only view of this calendar in their
        dashboard.
      </p>
    </form>
  );
};

export default MarkAttendance;
