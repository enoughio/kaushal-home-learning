import React from "react";
import TeacherRegistrationForm from "@/components/auth/TeacherRegistrationForm";

const TeacherRegistrationPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Teacher Registration
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the details below to register as a teacher
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-10">
          <TeacherRegistrationForm />
        </div>
      </div>
    </div>
  );
};

export default TeacherRegistrationPage;