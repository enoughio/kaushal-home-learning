import React from "react";
import skillsUnderline from "../../public/skills underline.svg";
import changeUnderline from "../../public/change underline.svg";
import tutorImage from "../../public/tutorImage.svg";
import studentImage from "../../public/studentImage.svg";
import Image from "next/image";
import NumberedCard from "@/components/numberCard";
import {
  startingText,
  textAfterValues,
  valueCards,
} from "@/data/About-page-data";
import Underline from "@/components/underlineComponent";
import StatCards from "@/components/statCards";
import TutorStudentJoin from "@/components/tutorStudentJoin";

const About = () => {
  return (
    <div className="p-8 pb-28 sm:p-12 xl:p-24 flex flex-col gap-20 lg:gap-28 items-center font-light ">
      <div className="">
        <div className="my-5 lg:my-10">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl">
            We Are The <br />
            Home of{" "}
            <span className="font-bold relative inline-block">
              <Underline text={"Skills"} imageSrc={skillsUnderline} />
              <Image
                src={"./skillsDecoration.svg"}
                alt=""
                aria-hidden={true}
                width={100}
                height={100}
                className="absolute top-0 right-0 -translate-y-[70%] translate-x-[55%] size-[70%]"
              />
            </span>
          </h1>
        </div>
        <div className="flex flex-col md:flex-row  gap-8 md:gap-14 2xl:gap-20">
          <p className="text-xl 2xl:text-2xl text-justify">{startingText}</p>
          <div className="md:w-48 text-right">
            <p className="text-4xl sm:text-3xl 2xl:text-4xl">
              Skills are not just learned, they are nurtured —{" "}
              <span className="text-[#FEB401] font-semibold">
                they light the path from curiosity to confidence.
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="w-full lg:px-10 space-y-10">
        <div className="flex flex-col items-center text-center md:flex-row md:justify-between lg:text-left">
          <p className="text-5xl md:text-6xl font-semibold">Our Values</p>
          <p className="mt-2 md:mt-0">
            The principles that{" "}
            <span className="hidden md:inline">
              <br />
            </span>{" "}
            shape who we are
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-10">
          {valueCards.map((card) => (
            <NumberedCard
              key={card.number}
              number={card.number}
              alignment={card.alignment}
              heading={card.heading}
              text={card.text}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-10">
        <p className="whitespace-pre-line text-[14px] 2xl:text-[16px] sm:max-w-[40%] sm:px-5 lg:px-10 sm:py-2">
          {textAfterValues}
        </p>
        <div className="w-[3px] bg-gray-300 xl:bg-gray-700" />
        <div className="space-y-12 w-full xl:max-w-[45%] flex flex-col px-10 xl:px-20">
          <div>
            <div className="flex gap-3 items-center">
              <h3 className="text-6xl">Mission</h3>
              <Image
                src="./missionIcon.svg"
                alt=""
                aria-hidden="true"
                width={60}
                height={60}
                className="sm:size-16"
              />
            </div>
            <p className="text-xl xl:text-2xl">
              To inspire lifelong <br /> learners across India.
            </p>
          </div>
          <div>
            <div className="flex flex-row-reverse gap-3 items-center">
              <h3 className="text-6xl">Vision</h3>
              <Image
                src="/visionIcon.svg"
                alt=""
                aria-hidden="true"
                width={60}
                height={60}
                className="sm:size-16"
              />
            </div>
            <div className="text-end">
              <p className="text-xl  xl:text-2xl">
                To transform home learning <br />
                through affordable,
                <br />
                personalized mentorship.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-10 w-[70%]">
        <div className="self-center">
          <p className="text-3xl sm:hidden tracking-wide">
            Every skill learned here <br /> creates a{" "}
            <Underline
              text={"Change"}
              imageSrc={changeUnderline}
              underlineWidthInPer={70}
            />
          </p>
          <div className="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl hidden tracking-wider sm:flex">
            <div className="relative">
              <span className="inline mr-[1vw]">Every</span>
              <div className=" absolute left-0 bottom-2 2xl:bottom-4 sm:w-28 md:w-28 lg:w-44 xl:w-48 h-10 2xl:w-56">
                <Image
                  src="/change underline.svg"
                  alt=""
                  aria-hidden="true"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <p>
              skill learned here <br />{" "}
              <span className="inline-block w-20"></span> creates a Change
            </p>
          </div>
        </div>
        <StatCards />
      </div>
      <div className="space-y-12">
        <p className="text-5xl md:text-6xl xl:text-7xl tracking-wide text-center">
          What We Do
        </p>
        <TutorStudentJoin
          role={"Tutor"}
          text={
            "A comprehensive platform for educators to share knowledge, connect with learners, and build meaningful teaching experiences."
          }
          roleImage={tutorImage}
        />
        <TutorStudentJoin
          role={"Student"}
          text={
            "Career-focused skill development programs designed to prepare students for the modern workforce and future challenges."
          }
          roleImage={studentImage}
        />
      </div>
    </div>
  );
};

export default About;
