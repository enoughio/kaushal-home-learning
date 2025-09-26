import Image from "next/image";
import React from "react";

interface UnderlineProps {
  text: string;
  imageSrc: string;
  underlineWidthInPer?: number;
}

const Underline = ({ text, imageSrc, underlineWidthInPer }: UnderlineProps) => {
  return (
    <span className={`inline-block relative pb-2`}>
      {text}
      <Image
        src={imageSrc}
        alt=""
        aria-hidden="true"
        width={800}
        height={40}
        style={{
          width: `${underlineWidthInPer ?? 100}%`,
          left: `${underlineWidthInPer ? (100 - underlineWidthInPer) / 2 : 0}%`,
        }}
        className="absolute bottom-0 left-0 translate-y-1 pointer-events-none"
      />
    </span>
  );
};

export default Underline;
