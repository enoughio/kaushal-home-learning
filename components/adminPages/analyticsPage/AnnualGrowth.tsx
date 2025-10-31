// components/adminPage/analyticsPage/AnnualGrowth.tsx
import AnnualGrowthClient from "./AnnualGrowthClient";

export default function AnnualGrowth() {
  const annualGrowth = [
    { year: "2022", revenue: 1200000, students: 450, teachers: 85 },
    { year: "2023", revenue: 2800000, students: 1200, teachers: 180 },
    { year: "2024", revenue: 4500000, students: 2100, teachers: 320 },
    { year: "2025", revenue: 6200000, students: 3200, teachers: 450 },
  ];

  // Pass data as props to client component
  return <AnnualGrowthClient initialData={annualGrowth} />;
}
