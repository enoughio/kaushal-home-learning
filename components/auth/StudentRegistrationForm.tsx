"use client";

import { useState } from "react";
import { z } from "zod";
import toast from "react-hot-toast";
import Link from "next/link";
import { studentRegistrationSchema } from "@/lib/validation/studentRegistrationSchema";

type FormData = {
  firstName: string;
  lastName: string;
  gender: string;
  DateOfBirth: string;
  grade: string;
  schoolName: string;
  SchoolBoard: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  emergencyNumber: string;
  houseNumber: string;
  street: string;
  city: string;
  pincode: string;
  subjectsInterested: string[];
  preferedTimeSlots: string[];
  aadharFile: File | null;
  locationCoordinates: {
    latitude: number;
    longitude: number;
  };
};

const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "Hindi",
  "Social Studies",
  "Computer Science",
  "Physics",
  "Chemistry",
  "Biology",
];

const TIME_SLOTS = [
  "Morning (6AM-9AM)",
  "Mid-Morning (9AM-12PM)",
  "Afternoon (12PM-3PM)",
  "Evening (3PM-6PM)",
  "Night (6PM-9PM)",
];

const StudentRegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    gender: "",
    DateOfBirth: "",
    grade: "",
    schoolName: "",
    SchoolBoard: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    emergencyNumber: "",
    houseNumber: "",
    street: "",
    city: "",
    pincode: "",
    subjectsInterested: [],
    preferedTimeSlots: [],
    aadharFile: null,
    locationCoordinates: {
      latitude: 0,
      longitude: 0,
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (
    name: "subjectsInterested" | "preferedTimeSlots",
    value: string
  ) => {
    setFormData((prev) => {
      const array = prev[name];
      const isChecked = array.includes(value);
      return {
        ...prev,
        [name]: isChecked
          ? array.filter((item) => item !== value)
          : [...array, value],
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, aadharFile: file }));
  };

  const getLocation = () => {
    if ("geolocation" in navigator) {
      toast.loading("Getting your location...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          toast.dismiss();
          setFormData((prev) => ({
            ...prev,
            locationCoordinates: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          }));
          toast.success("Location captured successfully!");
        },
        (error) => {
          toast.dismiss();
          toast.error("Unable to get location. Please enable location services.");
          console.error("Location error:", error);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data
      const validatedData = studentRegistrationSchema.parse(formData);

      setIsSubmitting(true);
      toast.loading("Submitting registration...");

      // Create FormData for multipart/form-data
      const submitData = new FormData();
      
      // Add JSON data
      const jsonData = {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        gender: validatedData.gender,
        DateOfBirth: validatedData.DateOfBirth,
        grade: validatedData.grade,
        schoolName: validatedData.schoolName,
        SchoolBoard: validatedData.SchoolBoard,
        parentName: validatedData.parentName,
        parentPhone: validatedData.parentPhone,
        parentEmail: validatedData.parentEmail,
        emergencyNumber: validatedData.emergencyNumber,
        houseNumber: validatedData.houseNumber,
        street: validatedData.street,
        city: validatedData.city,
        pincode: validatedData.pincode,
        subjectsInterested: validatedData.subjectsInterested,
        locationCoordinates: validatedData.locationCoordinates,
        preferedTimeSlots: validatedData.preferedTimeSlots,
      };

      submitData.append("json", JSON.stringify(jsonData));
      submitData.append("aadharFile", validatedData.aadharFile);

      const response = await fetch("/api/register/student", {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();
      toast.dismiss();

      if (response.ok) {
        toast.success(result.message || "Registration successful!");
        setShowSuccessMessage(true);
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          gender: "",
          DateOfBirth: "",
          grade: "",
          schoolName: "",
          SchoolBoard: "",
          parentName: "",
          parentPhone: "",
          parentEmail: "",
          emergencyNumber: "",
          houseNumber: "",
          street: "",
          city: "",
          pincode: "",
          subjectsInterested: [],
          preferedTimeSlots: [],
          aadharFile: null,
          locationCoordinates: {
            latitude: 0,
            longitude: 0,
          },
        });
      } else {
        // Handle validation errors
        if (result.details && Array.isArray(result.details)) {
          result.details.forEach((detail: { field: string; message: string }) => {
            toast.error(`${detail.field}: ${detail.message}`);
          });
        } else {
          toast.error(result.message || "Registration failed");
        }
      }
    } catch (error) {
      toast.dismiss();
      if (error instanceof z.ZodError) {
        // Show first validation error
        const firstError = error.issues[0];
        toast.error(firstError.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
        console.error("Registration error:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccessMessage) {
    return (
      <div className="text-center py-8 animate-in fade-in duration-500">
        <div className="mb-6 animate-in zoom-in duration-700 delay-100">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4 animate-in slide-in-from-bottom duration-500 delay-200">
          Registration Successful!
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto animate-in slide-in-from-bottom duration-500 delay-300">
          Thank you for registering. Our team will review your application and contact you shortly for the next steps.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 max-w-md mx-auto text-left animate-in slide-in-from-bottom duration-500 delay-400">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Please check your email for confirmation. We will contact you within 2-3 business days.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom duration-500 delay-500">
          <div className="relative bg-black w-fit mx-auto">
            <button
              onClick={() => setShowSuccessMessage(false)}
              className="bg-[#0A85D1] text-white py-3 px-8 border-2 border-black hover:-translate-x-0 hover:-translate-y-0 -translate-x-[5px] -translate-y-[5px] transition-transform duration-200"
            >
              Register Another Student
            </button>
          </div>
          <div className="relative bg-black w-fit mx-auto">
            <Link
              href="/"
              className="block bg-white text-gray-900 py-3 px-8 border-2 border-black hover:-translate-x-0 hover:-translate-y-0 -translate-x-[5px] -translate-y-[5px] transition-transform duration-200"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      className="sm:w-full max-w-4xl mx-auto mt-10 sm:mt-0 flex flex-col gap-6 font-normal animate-in fade-in duration-500"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Student Registration
      </h2>

      {/* Personal Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="firstName" className="text-sm text-gray-700">
              First Name *
            </label>
            <div className="flex items-center relative bg-black">
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                required
                className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px]  transition-transform duration-200"
              />
              <div className="absolute bg-black h-full w-full -z-10" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="lastName" className="text-sm text-gray-700">
              Last Name *
            </label>
            <div className="flex items-center relative bg-black">
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                required
                className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200"
              />
              <div className="absolute bg-black h-full w-full -z-10" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="gender" className="text-sm text-gray-700">
              Gender *
            </label>
            <div className="flex items-center relative bg-black">
              <select
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`border bg-white w-full border-gray-800 px-3 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200 ${
                  formData.gender === "" ? "text-gray-500" : "text-gray-800"
                }`}
                required
              >
                <option value="" disabled hidden>
                  Select Gender
                </option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              <div className="absolute bg-black h-full w-full -z-10" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="DateOfBirth" className="text-sm text-gray-700">
              Date of Birth *
            </label>
            <div className="flex items-center relative bg-black">
              <input
                type="date"
                name="DateOfBirth"
                id="DateOfBirth"
                value={formData.DateOfBirth}
                onChange={handleInputChange}
                required
                className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200"
              />
              <div className="absolute bg-black h-full w-full -z-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Academic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="grade" className="text-sm text-gray-700">
              Grade *
            </label>
            <div className="flex items-center relative bg-black">
              <input
                type="text"
                name="grade"
                id="grade"
                value={formData.grade}
                onChange={handleInputChange}
                placeholder="e.g., 10th, 12th"
                required
                className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200"
              />
              <div className="absolute bg-black h-full w-full -z-10" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="schoolName" className="text-sm text-gray-700">
              School Name *
            </label>
            <div className="flex items-center relative bg-black">
              <input
                type="text"
                name="schoolName"
                id="schoolName"
                value={formData.schoolName}
                onChange={handleInputChange}
                placeholder="School Name"
                required
                className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200"
              />
              <div className="absolute bg-black h-full w-full -z-10" />
            </div>
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="SchoolBoard" className="text-sm text-gray-700">
              School Board *
            </label>
            <div className="flex items-center relative bg-black">
              <select
                name="SchoolBoard"
                id="SchoolBoard"
                value={formData.SchoolBoard}
                onChange={handleInputChange}
                className={`border bg-white w-full border-gray-800 px-3 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200 ${
                  formData.SchoolBoard === "" ? "text-gray-500" : "text-gray-800"
                }`}
                required
              >
                <option value="" disabled hidden>
                  Select School Board
                </option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="State Board">State Board</option>
                <option value="IB">IB</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute bg-black h-full w-full -z-10" />
            </div>
          </div>
        </div>

        {/* Subjects Interested */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">Subjects Interested *</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SUBJECTS.map((subject) => (
              <label
                key={subject}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.subjectsInterested.includes(subject)}
                  onChange={() =>
                    handleCheckboxChange("subjectsInterested", subject)
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">{subject}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Preferred Time Slots */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">
            Preferred Time Slots *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TIME_SLOTS.map((slot) => (
              <label key={slot} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.preferedTimeSlots.includes(slot)}
                  onChange={() => handleCheckboxChange("preferedTimeSlots", slot)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">{slot}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Parent Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Parent/Guardian Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="parentName" className="text-sm text-gray-700">
              Parent/Guardian Name *
            </label>
            <div className="flex items-center relative bg-black">
              <input
                type="text"
                name="parentName"
                id="parentName"
                value={formData.parentName}
                onChange={handleInputChange}
                placeholder="Parent Name"
                required
                className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200"
              />
              <div className="absolute bg-black h-full w-full -z-10" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="parentPhone" className="text-sm text-gray-700">
              Parent Phone *
            </label>
            <div className="flex items-center relative bg-black">
              <input
                type="tel"
                name="parentPhone"
                id="parentPhone"
                value={formData.parentPhone}
                onChange={handleInputChange}
                placeholder="+91XXXXXXXXXX"
                required
                className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200"
              />
              <div className="absolute bg-black h-full w-full -z-10" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="parentEmail" className="text-sm text-gray-700">
              Parent Email *
            </label>
            <div className="flex items-center relative bg-black">
              <input
                type="email"
                name="parentEmail"
                id="parentEmail"
                value={formData.parentEmail}
                onChange={handleInputChange}
                placeholder="parent@example.com"
                required
                className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200"
              />
              <div className="absolute bg-black h-full w-full -z-10" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="emergencyNumber" className="text-sm text-gray-700">
              Emergency Contact *
            </label>
            <div className="flex items-center relative bg-black">
              <input
                type="tel"
                name="emergencyNumber"
                id="emergencyNumber"
                value={formData.emergencyNumber}
                onChange={handleInputChange}
                placeholder="+91XXXXXXXXXX"
                required
                className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200"
              />
              <div className="absolute bg-black h-full w-full -z-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Address Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="houseNumber" className="text-sm text-gray-700">
              House Number *
            </label>
            <div className="flex items-center relative bg-black">
              <input
                type="text"
                name="houseNumber"
                id="houseNumber"
                value={formData.houseNumber}
                onChange={handleInputChange}
                placeholder="House/Flat Number"
                required
                className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200"
              />
              <div className="absolute bg-black h-full w-full -z-10" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="street" className="text-sm text-gray-700">
              Street *
            </label>
            <div className="flex items-center relative bg-black">
              <input
                type="text"
                name="street"
                id="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder="Street Name"
                required
                className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200"
              />
              <div className="absolute bg-black h-full w-full -z-10" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="city" className="text-sm text-gray-700">
              City *
            </label>
            <div className="flex items-center relative bg-black">
              <input
                type="text"
                name="city"
                id="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                required
                className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200"
              />
              <div className="absolute bg-black h-full w-full -z-10" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="pincode" className="text-sm text-gray-700">
              Pincode *
            </label>
            <div className="flex items-center relative bg-black">
              <input
                type="text"
                name="pincode"
                id="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="6-digit Pincode"
                required
                maxLength={6}
                className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200"
              />
              <div className="absolute bg-black h-full w-full -z-10" />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">
            Location Coordinates *
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={getLocation}
              className="relative bg-black w-fit"
            >
              <span className="block bg-[#0A85D1] text-white py-3 px-6 border-2 border-black hover:-translate-x-0 hover:-translate-y-0 -translate-x-[5px] -translate-y-[5px] transition-transform duration-200">
                Get My Location
              </span>
            </button>
            {formData.locationCoordinates.latitude !== 0 && (
              <span className="text-sm text-green-600">
                ✓ Location captured
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Document Upload */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Document Upload
        </h3>

        <div className="flex flex-col gap-2">
          <label htmlFor="aadharFile" className="text-sm text-gray-700">
            Aadhar Card (PDF/Image, Max 10MB) *
          </label>
          <div className="flex items-center relative bg-black">
            <input
              type="file"
              name="aadharFile"
              id="aadharFile"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              required
              className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            <div className="absolute bg-black h-full w-full -z-10" />
          </div>
          {formData.aadharFile && (
            <p className="text-sm text-gray-600">
              Selected: {formData.aadharFile.name}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="relative self-end mt-4 w-fit bg-black">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#0A85D1] text-white py-3 px-8 border-2 border-black hover:-translate-x-0 hover:-translate-y-0 -translate-x-[5px] -translate-y-[5px] transition-transform duration-200 active:-translate-x-0 active:-translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Registration"}
        </button>
      </div>
    </form>
  );
};

export default StudentRegistrationForm;