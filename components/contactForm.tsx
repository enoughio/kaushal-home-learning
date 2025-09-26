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
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-700">fesf</label>
        <input
          type="text"
          name="test"
          value={formData.test}
          onChange={handleChange}
          placeholder="Filled"
          className="border border-gray-800 px-4 py-3 outline-none focus:shadow-[5px_5px_0_rgba(0,0,0,1)] transition-shadow"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-700">sfsdf name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter"
          className="border border-gray-800 px-4 py-3 outline-none focus:shadow-[5px_5px_0_rgba(0,0,0,1)] transition-shadow"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-700">fsefsdf version</label>
        <select
          name="version"
          value={formData.version}
          onChange={handleChange}
          className={`border border-gray-800 px-3 py-3 outline-none focus:shadow-[5px_5px_0_rgba(0,0,0,1)] transition-shadow ${
            formData.version === "" ? "text-gray-500" : "text-gray-800"
          }`}
        >
          <option value="" disabled hidden>
            Enter
          </option>
          <option value="v1">v1</option>
          <option value="v2">v2</option>
          <option value="v3">v3</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-700">sfsdfsdf ID</label>
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange}
          placeholder="Enter"
          className="border border-gray-800 px-4 py-3 outline-none focus:shadow-[5px_5px_0_rgba(0,0,0,1)] transition-shadow"
        />
      </div>

      <button
        type="submit"
        className="mt-4 w-fit self-end bg-[#0A85D1] text-white py-3 px-6 border-2 border-black hover:shadow-none active:shadow-none shadow-[5px_5px_0_rgba(0,0,0,1)] transition-shadow duration-300"
      >
        Send Message
      </button>
    </form>
  );
};

export default ContactForm;
