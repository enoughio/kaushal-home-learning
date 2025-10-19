"use client";

import { useState } from "react";

export default function StudentRegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lasName: "",
    gender: "male",
    DateOfBirth: "",
    grade: "",
    schoolName: "",
    SchoolBoard: "",
    parentName: "",
    parentPhone: "",
    ParentEmail: "",
    emergencyNumber: "",
    houseNumber: "",
    street: "",
    city: "",
    pincode: "",
    subjectsInterested: [] as string[],
    parentAadhar: "",
    latitude: "",
    longitude: "",
    preferedTimeSlots: [] as string[],
  });

  const [aadharFile, setAadharFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAadharFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = new FormData();

      if (!aadharFile) {
        setMessage("Please upload Aadhar file");
        setLoading(false);
        return;
      }

      payload.append("aadharFile", aadharFile);
      payload.append(
        "json",
        JSON.stringify({
          ...formData,
          locationCoordinates: {
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
          },
        })
      );

      const res = await fetch("/api/student/register", {
        method: "POST",
        body: payload,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setMessage(data.message || "Registration successful!");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 space-y-4 border rounded-xl bg-white shadow"
    >
      <h2 className="text-xl font-semibold text-center">
        Student Registration Form
      </h2>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <input
          name="firstName"
          placeholder="First Name"
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="lasName"
          placeholder="Last Name"
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input
          type="date"
          name="DateOfBirth"
          onChange={handleChange}
          required
          className="border p-2 rounded col-span-2"
        />
      </div>

      {/* Address */}
      <div className="grid grid-cols-2 gap-4">
        <input
          name="houseNumber"
          placeholder="House No."
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="street"
          placeholder="Street"
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="city"
          placeholder="City"
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="pincode"
          placeholder="Pincode"
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
      </div>

      {/* School Info */}
      <div className="grid grid-cols-2 gap-4">
        <input
          name="schoolName"
          placeholder="School Name"
          onChange={handleChange}
          required
          className="border p-2 rounded col-span-2"
        />
        <input
          name="SchoolBoard"
          placeholder="School Board"
          onChange={handleChange}
          required
          className="border p-2 rounded col-span-2"
        />
        <input
          name="grade"
          placeholder="Grade"
          onChange={handleChange}
          required
          className="border p-2 rounded col-span-2"
        />
      </div>

      {/* Parent Info */}
      <div className="grid grid-cols-2 gap-4">
        <input
          name="parentName"
          placeholder="Parent Name"
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="parentPhone"
          placeholder="Parent Phone"
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="ParentEmail"
          type="email"
          placeholder="Parent Email"
          onChange={handleChange}
          required
          className="border p-2 rounded col-span-2"
        />
        <input
          name="emergencyNumber"
          placeholder="Emergency Contact"
          onChange={handleChange}
          required
          className="border p-2 rounded col-span-2"
        />
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-2 gap-4">
        <input
          name="latitude"
          placeholder="Latitude"
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="longitude"
          placeholder="Longitude"
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium">Upload Aadhar File</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          required
          className="border p-2 rounded w-full"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Register"}
      </button>

      {message && (
        <p className="text-center text-sm mt-2 text-gray-700">{message}</p>
      )}
    </form>
  );
}
