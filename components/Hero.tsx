import Image from "next/image";

const Hero = () => {
  return (
    <div className="pt-14  lg:section  max-w-screen h-screen  ">
      <main className="w-full h-full bg-white flex flex-col items-center justify-start   ">
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
              className="max-w-full  md:h-[450px] lg:h-[65vh]"
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
    </div>
  );
};

export default Hero;
