"use client";

import { useState } from "react";
import { z } from "zod";
import toast from "react-hot-toast";
import Link from "next/link";
import { teacherRegistrationSchema } from "@/lib/validation/teacherRegistrationSchema";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  houseNumber: string;
  street: string;
  city: string;
  pincode: string;
  qualification: string;
  tenthPercentage: string;
  twelfthPercentage: string;
  marksheetTenth: File | null;
  marksheetTwelfth: File | null;
  aadhar: File | null;
};

const TeacherRegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    houseNumber: "",
    street: "",
    city: "",
    pincode: "",
    qualification: "",
    tenthPercentage: "",
    twelfthPercentage: "",
    marksheetTenth: null,
    marksheetTwelfth: null,
    aadhar: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof FormData) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, [fieldName]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data
      const validatedData = teacherRegistrationSchema.parse(formData);

      setIsSubmitting(true);
      toast.loading("Submitting registration...");

      // Create FormData for multipart/form-data
      const submitData = new FormData();

      // Add JSON data
      const jsonData = {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        dateOfBirth: validatedData.dateOfBirth,
        houseNumber: validatedData.houseNumber,
        street: validatedData.street,
        city: validatedData.city,
        pincode: validatedData.pincode,
        qualification: validatedData.qualification,
        tenthPercentage: validatedData.tenthPercentage,
        twelfthPercentage: validatedData.twelfthPercentage,
      };

      submitData.append("json", JSON.stringify(jsonData));
      submitData.append("marksheetTenthFile", validatedData.marksheetTenth);
      submitData.append("marksheetTwelfthFile", validatedData.marksheetTwelfth);
      submitData.append("aadharFile", validatedData.aadhar);

      const response = await fetch("/api/register/teacher", {
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
          email: "",
          phone: "",
          dateOfBirth: "",
          houseNumber: "",
          street: "",
          city: "",
          pincode: "",
          qualification: "",
          tenthPercentage: "",
          twelfthPercentage: "",
          marksheetTenth: null,
          marksheetTwelfth: null,
          aadhar: null,
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
          Thank you for registering as a teacher. Please check your email to verify your account.
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
                A verification link has been sent to your email. Please verify your account to proceed.
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
              Register Another Teacher
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
        Teacher Registration
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
                className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200"
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
            <label htmlFor="email" className="text-sm text-gray-700">
              Email *
            </label>
            <div className="flex items-center relative bg-black">
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                required
                className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200"
              />
              <div className="absolute bg-black h-full w-full -z-10" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-sm text-gray-700">
              Phone Number *
            </label>
            <div className="flex items-center relative bg-black">
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91XXXXXXXXXX"
                required
                className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200"
              />
              <div className="absolute bg-black h-full w-full -z-10" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="dateOfBirth" className="text-sm text-gray-700">
              Date of Birth *
            </label>
            <div className="flex items-center relative bg-black">
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
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
      </div>

      {/* Educational Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Educational Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="qualification" className="text-sm text-gray-700">
              Highest Qualification *
            </label>
            <div className="flex items-center relative bg-black">
              <textarea
                name="qualification"
                id="qualification"
                value={formData.qualification}
                onChange={handleInputChange}
                placeholder="e.g., B.Ed, M.A. in English, etc."
                required
                rows={3}
                className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200 resize-none"
              />
              <div className="absolute bg-black h-full w-full -z-10" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="tenthPercentage" className="text-sm text-gray-700">
              10th Percentage *
            </label>
            <div className="flex items-center relative bg-black">
              <input
                type="number"
                name="tenthPercentage"
                id="tenthPercentage"
                value={formData.tenthPercentage}
                onChange={handleInputChange}
                placeholder="e.g., 85.5"
                required
                step="0.01"
                min="0"
                max="100"
                className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200"
              />
              <div className="absolute bg-black h-full w-full -z-10" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="twelfthPercentage" className="text-sm text-gray-700">
              12th Percentage *
            </label>
            <div className="flex items-center relative bg-black">
              <input
                type="number"
                name="twelfthPercentage"
                id="twelfthPercentage"
                value={formData.twelfthPercentage}
                onChange={handleInputChange}
                placeholder="e.g., 88.0"
                required
                step="0.01"
                min="0"
                max="100"
                className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200"
              />
              <div className="absolute bg-black h-full w-full -z-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Document Upload */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Document Upload
        </h3>

        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="marksheetTenth" className="text-sm text-gray-700">
              10th Marksheet (PDF/Image, Max 5MB) *
            </label>
            <div className="flex items-center relative bg-black">
              <input
                type="file"
                name="marksheetTenth"
                id="marksheetTenth"
                onChange={(e) => handleFileChange(e, "marksheetTenth")}
                accept=".pdf,.jpg,.jpeg,.png"
                required
                className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
              <div className="absolute bg-black h-full w-full -z-10" />
            </div>
            {formData.marksheetTenth && (
              <p className="text-sm text-gray-600">
                Selected: {formData.marksheetTenth.name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="marksheetTwelfth" className="text-sm text-gray-700">
              12th Marksheet (PDF/Image, Max 5MB) *
            </label>
            <div className="flex items-center relative bg-black">
              <input
                type="file"
                name="marksheetTwelfth"
                id="marksheetTwelfth"
                onChange={(e) => handleFileChange(e, "marksheetTwelfth")}
                accept=".pdf,.jpg,.jpeg,.png"
                required
                className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
              <div className="absolute bg-black h-full w-full -z-10" />
            </div>
            {formData.marksheetTwelfth && (
              <p className="text-sm text-gray-600">
                Selected: {formData.marksheetTwelfth.name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="aadhar" className="text-sm text-gray-700">
              Aadhar Card (PDF/Image, Max 5MB) *
            </label>
            <div className="flex items-center relative bg-black">
              <input
                type="file"
                name="aadhar"
                id="aadhar"
                onChange={(e) => handleFileChange(e, "aadhar")}
                accept=".pdf,.jpg,.jpeg,.png"
                required
                className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
              <div className="absolute bg-black h-full w-full -z-10" />
            </div>
            {formData.aadhar && (
              <p className="text-sm text-gray-600">
                Selected: {formData.aadhar.name}
              </p>
            )}
          </div>
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

export default TeacherRegistrationForm;