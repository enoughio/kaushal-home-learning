import Family from "@/components/Family";
import Hero from "@/components/Hero";
import Marqui from "@/components/Marqui";
// import MissionVision from "@/components/MissionVision";
import Registration from "@/components/Registration";
import Reviews from "@/components/Reviews";
import Stats from "@/components/Stats";
import What from "@/components/what";
import Why from "@/components/why/Why";

export default function Home() {
  return (
    <div className=" w-screen  ">
        <Hero />
        <What  />
        <Why />
        <Stats />
        <div id="reviews">
        <Reviews />
        </div>
        <Family />
        <Marqui />
        <Registration />
        {/* <MissionVision /> */}

        {/* <div className="w-screen h-screen"></div> */}

    </div>
  );
}
