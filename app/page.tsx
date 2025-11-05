import Family from "@/components/ui/home/Family";
import Hero from "@/components/ui/home/Hero";
import Marqui from "@/components/ui/home/Marqui";
// import MissionVision from "@/components/MissionVision";
import Registration from "@/components/ui/home/Registration";
import Reviews from "@/components/ui/home/Reviews";
import Stats from "@/components/ui/home/Stats";
import What from "@/components/ui/home/what";
import Why from "@/components/ui/home/why/Why";

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
