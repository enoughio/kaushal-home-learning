"use client";

import { useState } from "react";

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    for: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form
      className="sm:w-full mx-auto mt-10 sm:mt-0 flex flex-col gap-6 font-normal"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm text-gray-700">
          Full Name
        </label>
        <div className="flex items-center relative">
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200 "
          />
          <div className="absolute bg-black h-full w-full -z-10" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm text-gray-700">
          Email
        </label>
        <div className="flex items-center relative">
          <input
            type="text"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter"
            required
            className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200 "
          />
          <div className="absolute bg-black h-full w-full -z-10" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="for" className="text-sm text-gray-700">
          Query For
        </label>
        <div className="flex items-center relative">
          <select
            name="for"
            id="for"
            value={formData.for}
            onChange={handleChange}
            className={`border bg-white w-full border-gray-800 px-3 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200  ${
              formData.for === "" ? "text-gray-500" : "text-gray-800"
            }`}
            required
          >
            <option value="" disabled hidden>
              Query related to
            </option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
          <div className="absolute bg-black h-full w-full -z-10" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm text-gray-700">Message</label>
        <div className="flex items-center relative">
          <textarea
            name="message"
            id="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter your message"
            required
            rows={4}
            className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200 resize-none"
          />
          <div className="absolute bg-black h-full w-full -z-10" />
        </div>
      </div>

      <div className="relative self-end mt-4 w-fit bg-black">
        <button
          type="submit"
          className="bg-[#0A85D1] text-white py-3 px-6 border-2 border-black hover:-translate-x-0 hover:-translate-y-0 -translate-x-[5px] -translate-y-[5px] transition-transform duration-200 active:-translate-x-0 active:-translate-y-0"
        >
          Send Message
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
