import Image from "next/image";

const What = () => {
  return (
    <div className="section w-screen min-h-screen section flex flex-col items-center gap-6 pb-10 font-urbansit ">
      <header>
        <div className="flex flex-col relative  w-fit mx-auto">
          {/* <div className="flex justify-center mt-4 h-[50px] w-[50px] absolute bottom-14 -left-5 sm:-left-10  ">
            <Image
              src="/upperHyphen.png"
              alt="Why Choose Us"
              width={50}
              height={50}
              className="w-full h-auto rotate-270 "
            />
          </div> */}

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

      <p className="sm:max-w-[71%] sm:text-center text-md leading-5 sm:leading-6">
        Kaushaly is more than just tutoring. We are a personalized learning
        platform designed to help every learner grow at their own pace — whether
        it's mastering a subject, preparing for exams, or simply falling in love
        with learning again.
      </p>

      <div className="container  sm-pr-0">
        <div
          className="box red border-2 pl-3 pt-3 flex justify-st items-center gap-2 relative bg-white"
          style={{
            backgroundImage: "url(/grid1.png)",
            backgroundSize: "60% 80%",
            backgroundPosition: "bottom right",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="max-w-[50%] pb-15">
            <h2 className="text-xl font-bold mb-2 leading-none ">
              Comprehensive
              <br />
              <span className="text-primary"> Learning </span>{" "}
            </h2>

            <p className="text-xs md:text-sm leading-4 md:leading-5 font-thin  mt-2 ">
              At Kaushaly, we believe no subject is too hard when learning is
              guided the right way. From mathematics to machine learning, from
              languages to life skills.
            </p>
          </div>

          <div className="w-full h-full  absolute top-3 left-3 bg-black -z-10" />
        </div>

        <div className="box purple flex items-center justify-between px-3  gap-3 relative bg-white border-2">
          <h2 className="text-lg md:text-xl font-bold leading-none ">
            <span className="text-primary">Personalized </span>
            <br />
            Approch
          </h2>

          <div className=" min-w-[25%] max-w-[28%] h-[100%] flex items-center justify-center  ">
            <img
              src="/grid2.png"
              alt="Personalized"
              // width={200}
              // height={200}
              className="w-full h-full object-fill"
            />
          </div>
          <p className="leading-4.5 font-thin text-xs md:text-sm">
            Tailered session for <br /> individual grouth
          </p>

          <div className="w-full h-full  absolute top-3 left-3 bg-black -z-10" />
        </div>

        <div className="box yellow bg-white border-2 relative flex items-center p-3 justify-between" 
             style={{
            backgroundImage: "url(/grid3.png)",
            backgroundSize: "45% 100%",
            backgroundPosition: "bottom right",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div>

            
          <h2 className="text-lg font-bold mb-2 leading-none ">
            Comprehensive
            <br />
            <span className="text-primary"> Learning </span>{" "}
          </h2>

            <p className="leading-4.5 text-xs md:text-sm  font-thin ">
              Launch your potential to <br /> new heights
            </p>
          </div>


          <div className="w-full h-full absolute top-3 left-3 bg-black -z-10" />
        </div>
      </div>
    </div>
  );
};

export default What;
