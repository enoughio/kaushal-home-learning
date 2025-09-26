const StatCards = () => {
  return (
    <div className="sm:h-72 flex flex-col sm:flex-row">
      <div className="h-full sm:w-[42%] p-8 sm:pl-12 text-xl text-white grid grid-rows-2 sm:grid-rows-1 bg-[#0A85D1] border-2 border-black">
        <div className="flex flex-col gap-3">
          <p className="text-3xl">
            25,000+ <br />
            Sessions
          </p>
          <div className="h-[1.5px] w-14  bg-white"></div>
        </div>
        <div className="flex justify-end sm:justify-start">
          <p className="font-extralight">
            Conducted <br />
            across
            <br /> diverse skills
          </p>
        </div>
      </div>
      <div className="h-3 sm:h-full px-5 sm:px-0 sm:py-5 sm:w-3 z-10 flex justify-around items-center sm:flex-col sm:justify-around">
        {[1, 2, 3, 4, 5, 6, 7].map((val) => (
          <div
            key={val}
            className="h-9 sm:h-3 w-4 sm:w-8 bg-white rounded-2xl"
          ></div>
        ))}
      </div>
      <div className="h-full sm:w-[25%] p-8 text-xl grid grid-cols-2 sm:grid-cols-1 bg-[#FEB401] border-2 border-black">
        <div className="flex flex-col gap-3">
          <p className="text-3xl">
            50+ <br />
            Cities
          </p>
          <div className="h-[1.5px] w-14 sm:mx-auto bg-black"></div>
        </div>
        <div className="flex justify-end sm:justify-start sm:items-end">
          <p className="font-extralight">
            where <br />
            Kaushalya is <br /> making a <br />
            difference
          </p>
        </div>
      </div>
      <div className="h-3 sm:h-full px-5 sm:px-0 sm:py-5 sm:w-3 z-10 flex justify-around items-center sm:flex-col sm:justify-around">
        {[1, 2, 3, 4, 5, 6, 7].map((val) => (
          <div
            key={val}
            className="h-9 sm:h-3 w-4 sm:w-8 bg-white rounded-2xl"
          ></div>
        ))}
      </div>
      <div className="h-full sm:w-[33%] p-8 text-xl text-white grid grid-rows-2 sm:grid-rows-1 bg-[#0A85D1] border-2 border-black">
        <div className="flex flex-col gap-3">
          <p className="text-3xl">
            95% <br />
            Satisfaction
          </p>
          <div className="h-[1.5px] w-14  bg-white"></div>
        </div>
        <div className="flex justify-end sm:justify-start">
          <p className="font-extralight">
            learners <br />
            achieving <br />
            their goals
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatCards;
