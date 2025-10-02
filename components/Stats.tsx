const Stats = () => {
  return (
    <div className="w-full  md:mt-15 px-6 py-8 md:px-25 ">
      <div className="font-urbanist flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Left side - Text content */}
        <div className="lg:w-[50%] space-y-4">
          <h1 className="font-bold text-2xl  leading-none">
            We collaborate with Amazing teachers
          </h1>
          <p className="text-gray-600 text-base  md:text-lg leading-6">
            At Kaushaly, we believe in the power of partnership. By collaborating
            with schools, educators, and communities, we've built a learning
            ecosystem that extends beyond just tutoring.
          </p>
        </div>

        {/* Right side - Stats */}
        <div className="flex flex-row ml-auto lg:flex-row gap-6 lg:gap-8">
          
          {/* Stat 1 - Students */}
          <div className="border-l-2 border-black pl-6 py-2">
            <h2 className="text-4xl font-bold mb-2">110+</h2>
            <p className="text-gray-700 text-base ">
              Students learning<br />with us
            </p>
          </div>

          {/* Stat 2 - Tutors */}
          <div className="border-l-2 border-black pl-6 py-2">
            <h2 className="text-4xl font-bold mb-2">64</h2>
            <p className="text-gray-700 text-base ">
              <span className="text-blue-500 font-semibold">Skilled</span> Tutors across<br />subject
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Stats;
