import Image from "next/image";
import Grid from "./Grid";

// Define the type for grid items
type GridItemType = {
  title1: string;
  title2: string;
  img: string;
  alt: string;
};

const gridItem: GridItemType[] = [
  {
    title1: "Personalized ",
    title2: "learning",
    img: "/whyGrid1.png",
    alt: "personalized learning",
  },

  {
    title1: "Flexible ",
    title2: "scheduling",
    img: "/whyGrid2.png",
    alt: "flexible scheduling",
  },

  {
    title1: "Affordable ",
    title2: "Learning",
    img: "/whyGrid3.png",
    alt: "affordable learning",
  },

  {
    title1: "Trusted ",
    title2: "Mentors",
    img: "/whyGrid4.png",
    alt: "trusted mentors",
  },

  {
    title1: "Circle of ",
    title2: "Growth",
    img: "/whyGrid5.png",
    alt: "circle of growth",
  },

  {
    title1: "Good Hands ",
    title2: "Foundation",
    img: "/whyGrid6.png",
    alt: "good hands foundation",
  },
];

const Why = () => {
  return (
    <div className="why-container px-3 pt-8 sm:px-10 md:px-15">
      <header>
        <div className="flex flex-col relative justify-center items-center w-fit mx-auto">
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
            <div className="">
              <h1 className="text-4xl font-bold  text-center mb-5">
                Why Student & Parents Trust{" "}
                <div className="inline-block relative">
                  {" "}
                  <span>Kaushaly</span>
                  <div className="absolute right-2 -bottom-3 translate-y-1/2">
                    <Image
                      src="/stroke.png"
                      alt="Stroke"
                      width={100}
                      height={50}
                      className="w-[150px] h-auto"
                    />
                  </div>{" "}
                </div>{" "}
                ?
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex justify-center md:justify-around mt-10 items-center gap-3 md:pr-15">
        <div className="font-bold text-xl sm:text-2xl md:text-4xl md:max-w-[35%] mb-5 ">
          Where <br /> Knowledge <br /> Meets Skills, and <br /> Skills Shape{" "}
          <br /> Tomorrow.
        </div>

        <div>
          <Image
            src="/whyImage.png"
            alt="Why Image"
            width={400}
            height={400}
            className="w-full h-auto max-w-[400px] "
          />
        </div>
      </div>

      <div className="why-grid w-full min-h-1/2 flex items-center justify-center flex-wrap gap-4">
        <div className="item text-white hidden md:flex items-center justify-center gap-3 p-3 w-[46%] h-[100px] md:w-[250px] md:h-[120px] relative">
          <h1 className="text-[.8rem] md:text-lg font-bold leading-none">
            {/* {title1} <br /> {title2} */}
          </h1>
          <div className="w-[60px] h-[60px] min-w-[30%]   flex items-center justify-center">
            {/* <Image
                   src={img}
                   alt={alt}
                   width={100}
                   height={100}
                   className='bg-green-400'
                 /> */}
          </div>
          {/* <div className="absolute top-2.5 -right-2 bg-black w-full h-full -z-10" /> */}
        </div>
        {gridItem.map((item: GridItemType, index: number) => (
          <Grid
            key={index}
            title1={item.title1}
            title2={item.title2}
            img={item.img}
            alt={item.alt}
          />
        ))}

        <div className="item  flex items-start justify-center gap-3 py-5 w-full  md:w-[250px]   h-[120px]  ">
          <h1 className=" md:text-lg font-thin leading-5">
            Contact us for <br /> cooperation
          </h1>
          <div className="w-[60px] h-[60px]  flex items-center justify-center">
            <Image src="/whyArrow.png" alt="arrow" width={100} height={100} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Why;
