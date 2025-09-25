import Image from "next/image";
import joinButton from "../public/Join Button.svg";

interface TutorStudentJoinProps {
  role: string;
  roleImage: string;
  text: string;
}

const TutorStudentJoin = ({ role, roleImage, text }: TutorStudentJoinProps) => {
  return (
    <div
      className={`flex flex-col ${
        role === "Tutor" ? "sm:flex-row" : "sm:flex-row-reverse"
      }  items-center justify-center gap-6 sm:gap-14`}
    >
      <Image src={roleImage} alt="Tutor Image" className="lg:size-[30vw]" />
      <div className="flex flex-col items-center sm:items-start md:w-[30%] gap-10">
        <p className="text-xl lg:text-2xl">{text}</p>
        <button className="border w-fit  rounded-3xl p-[2px] pl-3 flex items-center justify-center flex-nowrap">
          <span className="mx-3">Join as {role}</span>{" "}
          <Image src={joinButton} alt="Join Button Icon" />
        </button>
      </div>
    </div>
  );
};

export default TutorStudentJoin;
