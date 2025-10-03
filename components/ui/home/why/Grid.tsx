import Image from 'next/image'

type Prop = {
  title1 : string,
  title2 : string,
  img : string,
  alt : string
}

const Grid = ({title1, title2, img, alt} : Prop) => {
  return (
         <div className="item text-white flex items-center justify-center gap-3 p-3 bg-primary w-[46%] h-[100px] md:w-[250px] md:h-[120px] relative">    
              <h1 className="text-[.8rem] md:text-lg font-bold leading-none">
                {title1} <br /> {title2}
              </h1>
              <div className="w-[60px] h-[60px] min-w-[30%]   flex items-center justify-center">
                <Image
                  src={img}
                  alt={alt}
                  width={100}
                  height={100}
                  className=''
                />
              </div>
              <div className="absolute top-2.5 -right-2 bg-black w-full h-full -z-10" />
            </div>
  )
}

export default Grid