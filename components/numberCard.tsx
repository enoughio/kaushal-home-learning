import React from "react";

type NumberedCardProps = {
  number: string;
  alignment: "left" | "right";
  heading: string;
  text: string;
};

const NumberedCard: React.FC<NumberedCardProps> = ({ number, alignment, heading, text }) => {
  return (
    <div className="relative">
      <div
        className={`relative grid grid-cols-[1fr_1fr] gap-3 h-48 px-6 py-6 overflow-hidden bg-white border-3`}
      >
        <div
          className={`${
            alignment == "right" ? "col-start-2" : "col-start-1"
          } sm:w-auto`}
        >
          <h3 className={`text-xl font-semibold whitespace-nowrap`}>{heading}</h3>
          <p
            className={`absolute top-[50%] ${
              alignment == "right" ? "right-[5%]" : "left-[5%]"
            }  text-9xl font-extrabold text-[#0A85D1]`}
            style={{ WebkitTextStroke: "2px black" }}
          >
            {number}
          </p>
        </div>
        <div
          className={` flex justify-center items-center ${
            alignment == "right" ? "col-start-1" : "col-start-2"
          }`}
        >
          <p className="text-[70%] xl:text-[80%] 2xl:text-sm">{text}</p>
        </div>
      </div>
      <div className="bg-[#FEB401] h-48 w-full absolute top-3 left-3 md:border-3 -z-10"></div>
    </div>
  );
};

export default NumberedCard;
