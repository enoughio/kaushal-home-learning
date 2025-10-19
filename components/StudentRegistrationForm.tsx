"use client";
import { useState } from "react";

export default function ClientRegistrationForm() {
  const [formData, setFormData] = useState({
    email: "",
    role: "student",
    first_name: "",
    last_name: "",
    phone: "",
    house_number: "",
    street: "",
    city: "",
    pincode: "",
    date_of_birth: "",
    age: "",
    home_latitude: "",
    home_longitude: "",
    profile_image: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Handle form field change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Upload file to Cloudinary
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      const file = e.target.files[0];
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "your_unsigned_preset"); // replace with your Cloudinary preset

      const res = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      setUploading(false);

      if (!json.secure_url) {
        alert("❌ File upload failed. Please try again.");
        throw new Error("Cloudinary upload failed");
      }

      setFormData({ ...formData, profile_image: json.secure_url });
    }
  };

  // Get user's current location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            home_latitude: position.coords.latitude.toString(),
            home_longitude: position.coords.longitude.toString(),
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to fetch location. Please allow location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.profile_image) {
      alert("Please upload a profile image before submitting.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to register client");
      }

      alert("✅ Registration successful!");
      setFormData({
        email: "",
        role: "student",
        first_name: "",
        last_name: "",
        phone: "",
        house_number: "",
        street: "",
        city: "",
        pincode: "",
        date_of_birth: "",
        age: "",
        home_latitude: "",
        home_longitude: "",
        profile_image: "",
      });
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white shadow rounded-2xl space-y-4">
      <h2 className="text-2xl font-semibold text-center">Client Registration</h2>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required className="border p-2 rounded" />
        <input name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required className="border p-2 rounded" />
      </div>

      <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="border p-2 rounded w-full" />

      <input name="phone" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="border p-2 rounded w-full" />

      {/* Address */}
      <div className="grid grid-cols-2 gap-4">
        <input name="house_number" placeholder="House Number" value={formData.house_number} onChange={handleChange} className="border p-2 rounded" />
        <input name="street" placeholder="Street" value={formData.street} onChange={handleChange} className="border p-2 rounded" />
        <input name="city" placeholder="City" value={formData.city} onChange={handleChange} className="border p-2 rounded" />
        <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} className="border p-2 rounded" />
      </div>

      {/* DOB & Age */}
      <div className="grid grid-cols-2 gap-4">
        <input name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} required className="border p-2 rounded" />
        <input name="age" placeholder="Age" value={formData.age} onChange={handleChange} required className="border p-2 rounded" />
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-2 gap-4">
        <input name="home_latitude" placeholder="Latitude" value={formData.home_latitude} onChange={handleChange} required className="border p-2 rounded" />
        <input name="home_longitude" placeholder="Longitude" value={formData.home_longitude} onChange={handleChange} required className="border p-2 rounded" />
      </div>
      <button
        type="button"
        onClick={getLocation}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Use My Current Location
      </button>

      {/* File Upload */}
      <div>
        <label className="block text-gray-600 mb-1">Upload Profile Image</label>
        <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full border p-2 rounded" />
        {uploading && <p className="text-sm text-gray-500 mt-1">Uploading image...</p>}
        {formData.profile_image && (
          <img
            src={formData.profile_image}
            alt="Preview"
            className="mt-2 w-24 h-24 object-cover rounded-full border"
          />
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
      >
        {loading ? "Submitting..." : "Register Client"}
      </button>
    </form>
  );
}
