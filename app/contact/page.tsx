import ContactForm from "@/components/ui/contact/contactForm";
import Image from "next/image";

const Contact = () => {
  return (
    <div className="p-8 lg:p-28 font-light">
      <div className="uppercase sm:w-[50%]">
        <p className="text-[#0A85D1] text-2xl font-semibold">Get In Touch</p>
        <p className="text-4xl tracking-wide text-[#181D1F]">
          <span className="font-bold ">Contact</span> our support team to grow
          your business
        </p>
      </div>
      <div className="sm:hidden">
        <ContactForm />
      </div>
      <div className="relative hidden sm:grid grid-cols-[30%_60%] border-[3px] px-[5%] py-8 my-10 gap-[8%] shadow-[8px_8px_0_rgba(0,0,0,1)]">
        <div className="flex flex-col">
          <p className="sm:text-5xl md:text-6xl xl:text-7xl font-semibold my-10">Contact</p>
          <p className="sm:text-2xl lg:text-3xl">
            Become a mentor and{" "}
            <span className="font-bold">guide learners</span> on their journey.
          </p>
        </div>
        <ContactForm />
        <div className="absolute top-0 right-5 sm:w-48 sm:h-48 sm:-translate-y-[80%]   lg:w-64 lg:h-60 md:-translate-y-[81%]">
          <Image
            src={"/contactFormImage.svg"}
            alt=""
            fill
            sizes="(max-width: 640px) 12rem, (max-width: 1024px) 16rem, 16rem"
            className="object-contain  z-20"
            aria-hidden={true}
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row-reverse xl:justify-center xl:items-center gap-10 xl:gap-40 my-20 sm:my-28 px-10">
        <p className="text-gray-700 xl:w-[30%]">
          We strive to provide the best professionals to make your project a
          construction masterpiece, something unique and unrivaled.
        </p>
        <div className="space-y-3 xl:w-[20%]">
          <p> youremail2022@gmail.com</p>
          <p>(000) 123 456 789</p>
          <p>103/2 Seddon Park, Auckland, New Zealand</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
