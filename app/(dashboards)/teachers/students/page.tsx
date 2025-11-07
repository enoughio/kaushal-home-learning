import SearchList from "@/components/teachersPages/students/SearchList";
import Stats from "@/components/teachersPages/students/Stats";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";
import myFetch from "@/lib/requestHelper";

interface StudentData {
  id: number;
  name: string;
  age: number | null;
  status: string;
  phone: string;
  location: string;
  joinedDate: string;
  parentName: string;
  parentPhone: string;
  skillsLearning: string[];
}

/**
 * Fetch all students for teacher
 */
async function fetchTeacherStudents(): Promise<StudentData[]> {
  try {
    const response = await myFetch("/api/teacher/students");
    if (!response.ok) {
      console.error("Failed to fetch students:", response.status);
      return [];
    }

    const data = await response.json();
    return data?.data?.students || [];
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
}

interface StudentsPageProps {
  searchParams?: Promise<{ search?: string }>;
}

const StudentsPage = async ({ searchParams }: StudentsPageProps) => {
  // Fetch real data from API
  const allStudents = await fetchTeacherStudents();
  const params = (await searchParams) ?? {};
  const searchTerm = (params.search || "").toLowerCase();

  // Filter students by search term (search by name, email, phone, or location)
  const filteredStudents = allStudents.filter((student) => {
    if (!searchTerm) return true;
    return (
      student.name.toLowerCase().includes(searchTerm) ||
      student.phone.toLowerCase().includes(searchTerm) ||
      student.location.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Students</h1>
          <p className="text-muted-foreground">
            Manage and track your students progress
          </p>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <form
              className="flex"
              action="/teacher/students"
              method="GET"
            >
              <Input
                placeholder="Search students by name, phone, or location..."
                name="search"
                defaultValue={searchTerm}
                className="pl-10 bg-input"
              />
            </form>
          </div>
        </div>

        {/* Stats */}
        <Stats students={allStudents} />
      </div>

      {/* Student List */}
      <div>
        <SearchList
          filteredStudents={filteredStudents}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
};

export default StudentsPage;
