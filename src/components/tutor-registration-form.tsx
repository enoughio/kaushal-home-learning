"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle } from "lucide-react";
import { registerTutor  } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function TutorRegistrationForm() {
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "",
    age: "18",
    address: "",
    locations: "",
    education: "",
    marks10: "",
    marks12: "",
    idProof: "",
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
      const result = await registerTutor(formData);
      if (!result.successMessage) {
        throw new Error(result.errorMessage || "Failed to submit form");
      }
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormState({
          name: "",
          phone: "",
          email: "",
          gender: "",
          age: "18",
          address: "",
          locations: "",
          education: "",
          marks10: "",
          marks12: "",
          idProof: "",
          subjects: "",
        });
      }, 25000);
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || "There was an error submitting your registration.");
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
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
            <Input id="name" name="name" value={formState.name} onChange={handleChange} placeholder="John Doe" required className="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</label>
            <Input id="phone" name="phone" value={formState.phone} onChange={handleChange} placeholder="Phone" required className="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <Input id="email" name="email" type="email" value={formState.email} onChange={handleChange} placeholder="john@example.com" required className="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
          </div>
          <div className="space-y-2">
            <label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender</label>
            <Select name="gender" value={formState.gender} onValueChange={handleSelectChange}>
              <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200">
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
            <label htmlFor="age" className="text-sm font-medium text-gray-700">Age</label>
            <Input id="age" name="age" type="number" value={formState.age} onChange={handleChange} placeholder="25" required className="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
          </div>
          <div className="space-y-2">
            <label htmlFor="education" className="text-sm font-medium text-gray-700">Educational Qualification</label>
            <Input id="education" name="education" value={formState.education} onChange={handleChange} placeholder="e.g., B.Tech, M.Sc" required className="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="address" className="text-sm font-medium text-gray-700">Current Address</label>
            <Textarea id="address" name="address" rows={3} value={formState.address} onChange={handleChange} placeholder="Your current residential address" required className="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="locations" className="text-sm font-medium text-gray-700">Available Locations for Tutoring</label>
            <Input id="locations" name="locations" value={formState.locations} onChange={handleChange} placeholder="e.g., South Delhi, Noida Sector 18" required className="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
          </div>
          <div className="space-y-2">
            <label htmlFor="marks10" className="text-sm font-medium text-gray-700">10th Marksheet (Drive Link)</label>
            <Input id="marks10" name="marks10" value={formState.marks10} onChange={handleChange} placeholder="https://drive.google.com/..." required className="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
          </div>
          <div className="space-y-2">
            <label htmlFor="marks12" className="text-sm font-medium text-gray-700">12th Marksheet (Drive Link)</label>
            <Input id="marks12" name="marks12" value={formState.marks12} onChange={handleChange} placeholder="https://drive.google.com/..." required className="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="idProof" className="text-sm font-medium text-gray-700">ID Proof Photo (Drive Link)</label>
            <Input id="idProof" name="idProof" value={formState.idProof} onChange={handleChange} placeholder="https://drive.google.com/..." required className="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="subjects" className="text-sm font-medium text-gray-700">Subjects You Can Teach</label>
            <Input id="subjects" name="subjects" value={formState.subjects} onChange={handleChange} placeholder="e.g., Algebra, Chemistry, Guitar" required className="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 md:col-span-2 py-6">
            {isSubmitting ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center">
                Register as Tutor
              </span>
            )}
          </Button>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Registration Sent!</h3>
          <p className="text-gray-400 text-center">
            Thank you for registering. We'll get back to you within 24 hours.
          </p>
        </div>
      )}
    </div>
  );
}

