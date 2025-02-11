import { useContext, useState } from "react";
import AppContext from "../../../AppContext";
import { formattedTs } from "../utils";

export const Carousel = ({ showBotAvatar, imageUrl = [], ts, text,
  // showTimestamp
 }) => {
  const alt=imageUrl.map((x)=> x.alt)
  console.log("Alt: -------+" ,alt  )
  const img=imageUrl.map((x) => x.src)
  console.log("Images: -------+" ,img  )
  const appContext = useContext(AppContext);
  const { botAvatar,showTimestamp , botAvatarLogo} = appContext;

  // Limiting the number of images to 3
  const limitedImages = img.slice(0, 3);

  // State to keep track of the current image index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to handle previous image
  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? limitedImages.length - 1 : prevIndex - 1
    );
  };

  // Function to handle next image
  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === limitedImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="flex space-x-1">
      { botAvatarLogo && (
      <div className={`flex w-5 items-end`}>
        <img
          className={`h-5 w-5 rounded-full ${showBotAvatar ? "" : "hidden"}`}
          src={botAvatar}
          alt="BotAvatar"
        />
      </div>
      )}
      <div className="flex flex-col space-y-1">
        <div
          className={`mt-2 flex w-56 flex-wrap  self-start whitespace-pre-line  break-words text-sm `}
        >
          <div className=" bg-gray-200 h-fit p-3 relative rounded-2xl">
         <div className="w-fit mx-auto" >
           {text &&  <h1 className="hover:cursor-pointer mt-2 text-gray-900 font-bold text-xl tracking-tight">{text}</h1>}
          {limitedImages.length > 0 && (
            <div className="relative w-56  bg-white rounded-lg shadow-lg transition-all duration-300 ">
              <img
                className="rounded-t-lg w-60 h-48"
                src={limitedImages[currentIndex]}
                // alt={`Carousel Image ${currentIndex + 1}`}
                alt={alt}
              />
              {limitedImages.length > 1 && (
                <>
                  <button
                    className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white rounded-full px-2"
                    onClick={prevImage}
                  >
                    &#10094;
                  </button>
                  <button
                    className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white rounded-full px-2"
                    onClick={nextImage}
                  >
                    &#10095;
                  </button>
                </>
              )}
            </div>
          )}
            <div className="py-2 px-4">
                        <h1 className="hover:cursor-pointer mt-2 text-gray-900 font-bold text-xl tracking-tight">Hello I am the Robot you can buy me .
                        </h1>
                        <p className="hover:cursor-pointer text-sm py-3 text-gray-800 leading-6">I have so many advance feature i can reduce your work load .
                        </p>
                        <button
                  className="px-3 py-1 text-l transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none">Buy Me</button>
              </div>
          </div>
          </div>
        </div>
        {showTimestamp && (
          <div className="text-[10px] italic text-gray-500">
            {formattedTs(ts)}
          </div>
        )}
      </div>
    </div>
  );
};
