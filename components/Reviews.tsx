
const Reviews = () => {
  const reviews = [
    {
      name: "Priya Sharma",
      date: "12.12.2023",
      avatar: "/avatar1.png",
      review: "I've been using Kaushaly for my daughter's math tutoring for over a year now, and the results have been outstanding. The tutors are highly knowledgeable and provide personalized attention that has greatly improved her confidence and grades.",
    },
    {
      name: "Rajesh Patel",
      date: "12.12.2023",
      avatar: "/avatar2.png",
      review: "I recently enrolled my son on Kaushaly for science tutoring, and I'm thoroughly impressed. The platform is user-friendly, scheduling is flexible, and the tutor took time to understand his learning style and adapted the lessons accordingly.",
    },
    {
      name: "Anita Reddy",
      date: "12.12.2023",
      avatar: "/avatar3.png",
      review: "As a parent, I highly recommend Kaushaly. The tutors are professional, patient, and genuinely care about student success. From homework help to exam preparation, they've provided excellent support for my children's educational journey.",
    },
    {
      name: "Vikram Singh",
      date: "12.12.2023",
      avatar: "/avatar4.png",
      review: "I decided to try Kaushaly for my child's English lessons, and it was the best decision. The tutor is engaging and creates a comfortable learning environment where my son feels encouraged to participate and ask questions freely.",
    },
  ];

  return (
    <div className="w-full  px-6 md:px-16 py-8 md:py-8 bg-white font-urbanist">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-5">
          <div className="flex items-center justify-center gap-2 mb-2">
            {/* <Image 
              src="/upperHyphen.png" 
              alt="decorative" 
              width={40} 
              height={20}
              className="object-contain"
            /> */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              The Parents are always satisfied
            </h1>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {reviews.map((review, index) => (
            <div
              key={index}
              className={`p-3 rounded-2xl  ${ reviews.length - 1 == index ?  'hidden md:inline-block' : '' } `}
            >
              {/* Header with avatar, name and date */}
              <div className="flex items-center justify-between ">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden relative">
                    <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold">
                      {review.name.charAt(0)}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg">{review.name}</h3>
                </div>
                <span className="text-sm text-gray-400">{review.date}</span>
              </div>

              {/* Review Text */}
              <p className={`text-sm px-2 md:text-base leading-6 text-gray-700`}>
                {review.review}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Reviews;