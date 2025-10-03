'use client';

const Marqui = () => {
  const skills = [
    "Design",
    "Coding",
    "Craft",
    "Animation",
    "Music",
    "Cooking",
    "Photography",
    "Design",
    "Coding",
  ];

  return (
    <div className="w-full py-12 bg-white overflow-hidden">
      {/* First Row - Moving Left */}
      <div className="relative mb-6">
        <div className="flex animate-marquee-left whitespace-nowrap">
          {[...skills, ...skills].map((skill, index) => (
            <div
              key={`row1-${index}`}
              className="mx-3 px-8 py-4 bg-primary text-white text-lg md:text-xl font-semibold rounded-full border-t-1 border-b-5 border-black inline-block"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>

      {/* Second Row - Moving Right */}
      <div className="relative">
        <div className="flex animate-marquee-right whitespace-nowrap">
          {[...skills, ...skills].map((skill, index) => (
            <div
              key={`row2-${index}`}
              className="mx-3 px-8 py-4 bg-primary text-white text-lg md:text-xl font-semibold rounded-full border-t-1 border-b-5 border-black inline-block"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-marquee-left {
          animation: marquee-left 30s linear infinite;
        }

        .animate-marquee-right {
          animation: marquee-right 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Marqui;