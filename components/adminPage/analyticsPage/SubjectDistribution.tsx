// SubjectDistribution.tsx
import { SubjectDistributionClient } from "./SubjectDistributionClient";

export default async function SubjectDistribution() {
  // Fetch or define data on the server
  const subjectDistribution = [
    { subject: "Mathematics", students: 850, color: "#3b82f6" },
    { subject: "Science", students: 720, color: "#10b981" },
    { subject: "English", students: 650, color: "#f59e0b" },
    { subject: "Hindi", students: 480, color: "#ef4444" },
    { subject: "Social Studies", students: 420, color: "#8b5cf6" },
    { subject: "Computer Science", students: 380, color: "#06b6d4" },
  ];

  const locationStats = [
    { city: "Mumbai", students: 680, teachers: 95 },
    { city: "Delhi", students: 520, teachers: 78 },
    { city: "Bangalore", students: 450, teachers: 65 },
    { city: "Chennai", students: 380, teachers: 52 },
    { city: "Kolkata", students: 320, teachers: 48 },
    { city: "Pune", students: 280, teachers: 42 },
  ];

  return (
    <SubjectDistributionClient
      subjectDistribution={subjectDistribution}
      locationStats={locationStats}
    />
  );
}
