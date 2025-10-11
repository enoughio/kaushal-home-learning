import SearchList from "@/components/teachers/students/SearchList";
import Stats from "@/components/teachers/students/Stats";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

// Placeholder data for students
const students = [
	{
		id: 1,
		name: "John Doe",
		age: 15,
		status: "active",
		phone: "1234567890",
		location: "City A",
		joinedDate: "2024-06-01",
		parentName: "Jane Doe",
		parentPhone: "0987654321",
		skillsLearning: ["Math", "Science"],
	},
	{
		id: 2,
		name: "Alice Smith",
		age: 14,
		status: "inactive",
		phone: "2345678901",
		location: "City B",
		joinedDate: "2024-05-15",
		parentName: "Bob Smith",
		parentPhone: "1231231234",
		skillsLearning: ["English", "History"],
	},
	// ...add more as needed
];

// Placeholder search term
const searchTerm = "";

const StudentsPage = async () => {
	// In future, fetch data from API here using fetch or axios
	// const res = await fetch("API_URL");
	// const students = await res.json();

	// Filter students by searchTerm (for now, just return all)
	const filteredStudents = students; // Add filtering logic if needed

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">My Students</h1>
					<p className="text-muted-foreground">
						Manage and track your students' progress
					</p>
				</div>
			</div>

			{/* Search and Stats */}
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
				{/* Search Input */}
				<div className="lg:col-span-2">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
						<Input
							placeholder="Search students by name or subject..."
							value={searchTerm}
							readOnly
							className="pl-10 bg-input"
						/>
					</div>
				</div>

				{/* Stats */}
				<Stats students={students} />
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
