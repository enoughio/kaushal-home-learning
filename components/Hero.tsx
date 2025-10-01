import Image from "next/image";

const Hero = () => {
  return (
    <div className="lg:section max-w-screen max-h-[88vh] sm:max-h-screen  pt-14">
      <main className="w-full h-full bg-white sm:flex flex-col items-center justify-start hidden  ">
        <header className="font-gothic md:text-[3rem] leading-none lg:text-[2.8rem]  mt-2 sm:mx-15 md:mx-0 text-center">
          <h1>
            <span className="font-bold">Nurturing </span>
            <span className="font-bold text-primary">Skills, </span>
            <span className="text-nowrap font-normal md:text-[4rem] ">Build Futures</span>
          </h1>
        </header>
        <div className=" h-full w-full flex flex-col items-center justify-start ">

          <div className="max-w-full  ">



            <Image 
              src="/hero.png" 
              alt="Hero Image" 
              width={1000} 
              height={850}
              className="max-w-full hidden  sm:block md:h-[450px] lg:h-[65vh]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 73vw, 1000px"
              priority
            />
            {/* for tab height should be 800 */}
          </div>

          <div className="flex flex-col items-center  justify-start gap-3 h-full  ">
            <h1 className="font-urbansit text-xl">
              Learning Starts at Home. Success Starts with Kaushaly
            </h1>

            {/* TODO: Add arrow icon here */}
            <button className=" px-10 py-2 border text-black border-black  rounded-full   hover:bg-blue-700 transition">
              Get Started
            </button>
          </div>
        </div>
      </main>


{/* Hero section with illustration for mobile */}
      <main className="w-full max-h-screen sm:hidden h-screen flex flex-col items-center justify-start gap-1 pt-3 pb-2 bg-white ">
        {/* Header with title */}
        <header className="font-gothic text-center relative">
          <h1 className="text-[1.8rem] xs:text-[2rem] md:text-4xl leading-tight mb-1.5 xs:mb-2">
            <span className="font-normal text-black">Nurturing </span>
            <span className="font-bold text-primary">Skills, </span>
          </h1>

          <div className="text-right text-[1.7rem] xs:text-[1.9rem] sm:text-[2.1rem] leading-none absolute top-9 xs:top-10 sm:top-11 -right-3">
                <span className="font-normal text-black inline-block">Building </span>
                <br  />
            <span className="font-bold text-primary">Futures</span>
          </div>

        </header>

        {/* Main illustration */}
        <div className="flex-1 flex items-center justify-center max-w-4xl xs:max-h-[45.5vh] max-h-[46.5vh] w-full  xs:mb-4  sm:mb-1">
          <Image 
            src="/mobileHero.png" 
            alt="Hero Image" 
            width={600} 
            height={450}
            className="w-full h-full object-bottom-right "
            priority
          />
        </div>

        {/* Bottom section with tagline and button */}
        <div className="flex flex-col items-center gap-3 xs:gap-3 mb-4 xs:mb-3 ">
          <p className="text-base xs:text-md  font-normal text-left leading-4.5 xs:leading-6 text-gray-800 px-4 max-w-sm xs:max-w-md">
            Learning Starts at Home. Success Starts with Kaushaly
          </p>
          
          <button className="flex items-center gap-2 px-6 xs:px-8 py-2.5 xs:py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-sm xs:text-base">
            <span className="font-medium">Get Started</span>
            <div className="w-5 h-5 xs:w-6 xs:h-6 bg-white rounded-full flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="xs:w-3 xs:h-3 text-black">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Hero;
