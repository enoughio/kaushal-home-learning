import React from 'react'

// Accept student prop
const MarkAttendence = ({ student }: { student?: { id: string; name: string } }) => {
  // Placeholder state logic for server component (no hooks)
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <form
        className="rounded-lg border bg-background p-4 space-y-3"
        // onSubmit={...}
      >
        <div className="text-sm font-medium">Mark Attendance</div>
        <div className="text-xs text-muted-foreground mb-2">
          {student ? `Marking attendance for: ${student.name}` : "Select a student above"}
        </div>
        <label className="flex items-center justify-between gap-3">
          <span className="text-sm text-muted-foreground">Date</span>
          <input
            type="date"
            defaultValue={today}
            max={today}
            className="rounded-md border bg-background px-3 py-2 text-sm"
            // onChange={...}
          />
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          <span className="text-sm">I confirm I am physically at the student’s home for this session</span>
        </label>
        <label className="block">
          <div className="mb-1 text-sm text-muted-foreground">Notes (optional)</div>
          <textarea
            rows={3}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Lesson topic, duration, or other remarks"
            // onChange={...}
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-md border bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          // disabled={...}
        >
          Mark Present
        </button>
        <p className="text-xs text-muted-foreground">
          Students/parents have a read-only view of this calendar in their dashboard.
        </p>
      </form>
    </div>
  )
}

export default MarkAttendence