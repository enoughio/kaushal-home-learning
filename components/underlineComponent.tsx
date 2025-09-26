import Image from "next/image";
import React from "react";

interface UnderlineProps {
  text: string;
  imageSrc: string;
  underlineWidthInPer?: number;
}

const Underline = ({
  text,
  imageSrc,
  underlineWidthInPer,
}: UnderlineProps) => {

  return (
    <span
      className={`inline-block relative pb-2`}
    >
      {text}
      <Image
        src={imageSrc}
        alt="Change Underline"
        style={{
          width: `${underlineWidthInPer}%`,
          left: `${
            underlineWidthInPer ? (100 - underlineWidthInPer) / 2 : 0
          }%`,
        }}
        className={`absolute bottom-0 left-0 translate-y-1`}
      ></Image>
    </span>
  );
};

export default Underline;
