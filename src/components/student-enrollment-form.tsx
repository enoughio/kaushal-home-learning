'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle } from "lucide-react";
import { enrollStudent } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function StudentEnrollmentForm() {
    const [formState, setFormState] = useState({
        name: "",
        parentPhone: "",
        parentEmail: "",
        gender: "",
        grade: "",
        board: "",
        school: "",
        address: "",
        subjects: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormState((prev) => ({ ...prev, gender: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const result = await enrollStudent(formData);
            if (!result.successMessage) {
                throw new Error(result.errorMessage || "Failed to submit form");
            }
            setIsSubmitting(false);
            setIsSubmitted(true);
            setTimeout(() => {
                setIsSubmitted(false);
                setFormState({
                    name: "",
                    parentPhone: "",
                    parentEmail: "",
                    gender: "",
                    grade: "",
                    board: "",
                    school: "",
                    address: "",
                    subjects: "",
                });
            }, 25000);
        } catch (err: any) {
            setIsSubmitting(false);
            setError(err.message || "There was an error submitting your enrollment.");
        }
    };

    return (
        <div className="glass p-8 rounded-lg">
            {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {error && (
                        <Alert variant="destructive" className="mb-6 bg-red-900/20 border-red-600 md:col-span-2">
                            <AlertTitle className="text-red-400">Error</AlertTitle>
                            <AlertDescription className="text-gray-300">{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-2 md:col-span-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-300">Student's Full Name</label>
                        <Input id="name" name="name" value={formState.name} onChange={handleChange} placeholder="Jane Smith" required className="bg-gray-900/50 border-gray-700 focus:border-purple-500" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="parentPhone" className="text-sm font-medium text-gray-300">Parent/Guardian Phone</label>
                        <Input id="parentPhone" name="parentPhone" value={formState.parentPhone} onChange={handleChange} placeholder="9876543210" required className="bg-gray-900/50 border-gray-700 focus:border-purple-500" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="parentEmail" className="text-sm font-medium text-gray-300">Parent/Guardian Email</label>
                        <Input id="parentEmail" name="parentEmail" type="email" value={formState.parentEmail} onChange={handleChange} placeholder="parent@example.com" required className="bg-gray-900/50 border-gray-700 focus:border-purple-500" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="gender" className="text-sm font-medium text-gray-300">Gender</label>
                        <Select name="gender" value={formState.gender} onValueChange={handleSelectChange}>
                            <SelectTrigger className="bg-gray-900/50 border-gray-700 focus:border-purple-500">
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="grade" className="text-sm font-medium text-gray-300">Grade Level</label>
                        <Input id="grade" name="grade" value={formState.grade} onChange={handleChange} placeholder="e.g., 10th Grade" required className="bg-gray-900/50 border-gray-700 focus:border-purple-500" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="board" className="text-sm font-medium text-gray-300">Board</label>
                        <Input id="board" name="board" value={formState.board} onChange={handleChange} placeholder="e.g., CBSE, State Board" required className="bg-gray-900/50 border-gray-700 focus:border-purple-500" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="school" className="text-sm font-medium text-gray-300">School Name</label>
                        <Input id="school" name="school" value={formState.school} onChange={handleChange} placeholder="e.g., Delhi Public School" required className="bg-gray-900/50 border-gray-700 focus:border-purple-500" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label htmlFor="address" className="text-sm font-medium text-gray-300">Full Address</label>
                        <Textarea id="address" name="address" rows={3} value={formState.address} onChange={handleChange} placeholder="Your complete address" required className="bg-gray-900/50 border-gray-700 focus:border-purple-500" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label htmlFor="subjects" className="text-sm font-medium text-gray-300">Subjects/Skills to Learn</label>
                        <Input id="subjects" name="subjects" value={formState.subjects} onChange={handleChange} placeholder="e.g., Physics, Calculus, Guitar" required className="bg-gray-900/50 border-gray-700 focus:border-purple-500" />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full md:col-span-2">
                        {isSubmitting ? (
                            <span className="flex items-center">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                Enroll Now
                            </span>
                        )}
                    </Button>
                </form>
            ) : (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                        <CheckCircle className="h-10 w-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Enrollment Sent!</h3>
                    <p className="text-gray-400 text-center">
                        Thank you for enrolling. We'll get back to you within 24 hours.
                    </p>
                </div>
            )}
        </div>
    );
}
