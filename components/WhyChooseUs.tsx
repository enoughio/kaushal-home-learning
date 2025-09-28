import Image from "next/image";

const WhyChooseUs = () => {
  return (
    <div className="bg-red-500 w-screen min-h-screen section">
      <header>
        <div className="flex flex-col">
          
          <Image
            src="/upperHyphen.png"
            alt="Why Choose Us"
            width={50}
            height={50}
            className="w-full h-auto"
          />

          <h1 className="text-4xl font-bold text-white text-center mb-8">
            Why Choose Us
          </h1>
        </div>
      </header>

      <div className="container">
        <div className="box red"></div>
        <div className="box purple"></div>
        <div className="box yellow"></div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
