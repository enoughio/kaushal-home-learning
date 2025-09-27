"use client";

import { useState } from "react";

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    test: "",
    name: "",
    version: "",
    id: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
        <label htmlFor="test" className="text-sm text-gray-700">
          Test
        </label>
        <div className="flex items-center relative">
          <input
            type="text"
            name="test"
            id="test"
            value={formData.test}
            onChange={handleChange}
            placeholder="Enter"
            required
            className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200 "
          />
          <div className="absolute bg-black h-full w-full -z-10" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm text-gray-700">
          Name
        </label>
        <div className="flex items-center relative">
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter"
            required
            className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200 "
          />
          <div className="absolute bg-black h-full w-full -z-10" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="version" className="text-sm text-gray-700">
          Version
        </label>
        <div className="flex items-center relative">
          <select
            name="version"
            id="version"
            value={formData.version}
            onChange={handleChange}
            className={`border bg-white w-full border-gray-800 px-3 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200  ${
              formData.version === "" ? "text-gray-500" : "text-gray-800"
            }`}
            required
          >
            <option value="" disabled hidden>
              Enter
            </option>
            <option value="v1">v1</option>
            <option value="v2">v2</option>
            <option value="v3">v3</option>
          </select>
          <div className="absolute bg-black h-full w-full -z-10" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="id" className="text-sm text-gray-700">ID</label>
        <div className="flex items-center relative">
          <input
            type="text"
            name="id"
            id="id"
            value={formData.id}
            onChange={handleChange}
            placeholder="Enter"
            required
            className="w-full bg-white border border-gray-800 px-4 py-3 outline-none focus:-translate-x-[5px] focus:-translate-y-[5px] transition-transform duration-200 "
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
