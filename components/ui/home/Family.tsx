import Image from "next/image";

const Family = () => {
  return (
    <div className="w-full   md:px-10  bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            {/* <Image
              src="/upperHyphen.png"
              alt="decorative hyphen"
              width={40}
              height={20}
              className="object-contain"
            /> */}
            <h1 className="px-5 text-xl md:text-4xl font-bold">
              A Family of Learners &{" "}
              <div className="inline-block relative">
                {" "}
                <span>Kaushaly.</span>
                <div className="absolute right-2 -bottom-3 translate-y-1/2">
                  <Image
                    src="/stroke.png"
                    alt="Stroke"
                    width={100}
                    height={50}
                    className="w-[150px] h-auto"
                  />
                </div>{" "}
              </div>{" "}
            </h1>
          </div>
          <p className="text-md md:text-xl text-gray-700 italic">
            &ldquo;Alone we learn, together we thrive.&rdquo;
          </p>
        </div>

        {/* Stats Section with Images */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-24 ">
          {/* Tutor Section */}
          <div className="flex items-center  md:gap-8">
            <div className="relative w-[170px] h-[220px] sm:w-[200px] sm:h-[250px] md:w-[220px] md:h-[280px]">
              <Image
                src="/family1.png"
                alt="Teacher illustration"
                fill
                className="object-contain"
              />
            </div>
            <div className="text-left">
              <h2 className="text-6xl md:text-7xl font-bold mb-2">100+</h2>
              <p className="text-2xl md:text-3xl text-gray-800">Tutors</p>
            </div>
          </div>

          {/* Student Section */}
          <div className="flex items-center md:gap-8">
            <div className="relative w-[170px] h-[220px] sm:w-[200px] sm:h-[250px] md:w-[220px] md:h-[280px]">
              <Image
                src="/family2.png"
                alt="Student illustration"
                fill
                className="object-contain"
              />
            </div>
            <div className="text-left">
              <h2 className="text-6xl md:text-7xl font-bold mb-2">50+</h2>
              <p className="text-2xl md:text-3xl text-gray-800">Students</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Family;
