import React from "react";
import Image from "next/image";

const Registration = () => {
  return (
    <div>

        <div className="w-full pt-8 px-6 md:px-20 bg-white font-urbanist">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              
              {/* Left Side - Register Now Heading */}
              <div>
                <div className="flex items-start gap-2 mb-2">
                  <h1 className="text-6xl md:text-7xl lg:text-8xl font-normal leading-none">
                    REGISTER
                  </h1>
                  <Image 
                    src="/upperHyphen.png" 
                    alt="decorative" 
                    width={60} 
                    height={30}
                    className="object-contain mt-2"
                  />
                </div>
                <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-none">
                  NOW
                </h2>
              </div>

              {/* Right Side - Description Text */}
              <div className="lg:pt-4">
                <p className="text-sm md:text-base leading-relaxed text-gray-800">
                  Don't wait for tomorrow to build the skills you need today. At Kaushalya, every registration is the first step towards personalized learning, expert mentorship, and a community that grows with you. Whether you're a student ready to master new subjects or a tutor eager to share knowledge, your journey starts here.
                </p>
              </div>

            </div>
          </div>
        </div>


      <div className="w-full  py-16 px-6 md:px-16 bg-white flex items-center justify-center">
        <div className="max-w-6xl mx-auto">
          {/* Illustration at the top */}
          <div className="relative hidden sm:inline-block w-full max-w-2xl h-[250px] md:h-[300px] mx-auto ">
            <Image
              src="/formImage.png"
              alt="Teacher and student high-five illustration"
              fill
              className="object-contain"
            />
          </div>

          {/* Two Cards Side by Side */}
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 border-4 border-black rounded-none overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              {/* Join as Tutor Card - Left Side (Yellow) */}
              <div className="bg-yellow-400 p-6 md:p-10 space-y-5">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">
                    Join as Tutor
                  </h2>
                  <p className="text-sm md:text-base">
                    Share Your Skills. Inspire Growth
                  </p>
                </div>

                <div className=" leading-3  md:leading-4 ">
                  <p className="text-lg md:text-xl">
                    Become <span className="font-bold">a mentor</span>
                  </p>
                  <p className="text-lg md:text-xl">
                    and <span className="font-bold">guide learners</span>
                  </p>
                  <p className="text-lg md:text-xl">on their journey.</p>
                </div>

                <button className="flex items-center gap-3 bg-white border-2 border-black px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 mt-8">
                  <span>Join as Tutor</span>
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </div>
                </button>
              </div>

              {/* Join as Student Card - Right Side (White) */}
              <div className="bg-white p-6 md:p-10 space-y-5 border-l-4 border-black">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">
                    Join as Student
                  </h2>
                  <p className="text-sm md:text-base">
                    Master new skills and unlock your potential.
                  </p>
                </div>

                <div className="leading-3  md:leading-4">
                  <p className="text-lg md:text-xl">
                    Discover <span className="font-bold">new skills</span>
                  </p>
                  <p className="text-lg md:text-xl">from expert tutors</p>
                  <p className="text-lg md:text-xl">
                    tailored to your journey.
                  </p>
                </div>

                <button className="flex items-center gap-3 bg-white border-2 border-black px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-300 mt-8">
                  <span>Join as Student</span>
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
