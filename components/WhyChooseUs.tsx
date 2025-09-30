import Image from "next/image";

const WhyChooseUs = () => {
  return (
    <div className=" w-screen min-h-screen section mt-10 flex flex-col items-center gap-6 py-10">
      <header>
        <div className="flex flex-col relative  w-fit mx-auto">
          <div className="flex justify-center mt-4 h-[50px] w-[50px] absolute bottom-14 -left-10  ">
            <Image
              src="/upperHyphen.png"
              alt="Why Choose Us"
              width={50}
              height={50}
              className="w-full h-auto rotate-270 "
            />
          </div>

          <div>
            <div className="relative">
              <h1 className="text-4xl font-bold  text-center mb-5">
                What is Kaushaly?
              </h1>

              <div className="absolute right-8 -bottom-3 translate-y-1/2">
                <Image
                  src="/stroke.png"
                  alt="Stroke"
                  width={100}
                  height={50}
                  className="w-[150px] h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <p className="max-w-[71%] text-center text-md leading-6">
        Kaushaly is more than just tutoring. We are a personalized learning
        platform designed to help every learner grow at their own pace — whether
        it's mastering a subject, preparing for exams, or simply falling in love
        with learning again.
      </p>

      <div className="container">
        <div className="box red pl-3 pt-3 flex justify-between items-center gap-2 ">
         
          <div className="max-w-[32%]">
            <h2 className="text-xl font-bold mb-2 leading-none ">
              Comprehensive
              <br />
              <span className="text-primary"> Learning </span>{" "}
            </h2>

            <p className="text-sm leading-5  mt-2 ">
              At Kaushaly, we believe no subject is too hard when learning is
              guided the right way. From mathematics to machine learning, from
              languages to life skills
            </p>
          </div>

          <div className="w-[300px] h-[300px]  bg-amber-300">
            <Image 
                src={'/grid1.png'}
                alt="Grid"
                width={300}
                height={300}
                className="w-full h-full object-cover"
            />
          </div>

        </div>
        <div className="box purple flex  items-center justify-center p-3 gap-3">

          <h2 className="text-xl font-bold mb-2 leading-none ">
          Personalized Approch
          </h2>

          <div>
            <Image 
                src={'/grid2.png'}
                alt="Grid"
                width={40}
                height={60}
                className="w-full h-full object-cover"
            />
          </div>

          <p>Tailered session for individual grouth</p>
          
        </div>
        <div className="box yellow"></div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
