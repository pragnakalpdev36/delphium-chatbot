
import { useContext } from "react";
import AppContext from "../../../AppContext";
import { formattedTs } from "../utils";

export const Video = ({ showBotAvatar, videoUrl, ts, text,
  // showTimestamp
 }) => {
  console.log("video url---",videoUrl[0].src);
  const appContext = useContext(AppContext);
  const { botAvatar,showTimestamp,botAvatarLogo } = appContext;
  return (
    <div className="flex space-x-1">
      { botAvatarLogo &&(
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
          className={`w-fit min-w-[10%] max-w-[75%] ml-4 self-start whitespace-pre-line break-words text-sm `}
        >
          <div className=" bg-gray-200 h-fit p-3 relative rounded-2xl">
          {text && <div className="text-sm mb-1 font-bold">{text}</div>}
          <video className="rounded-xl shadow-sm" controls>
            <source src={videoUrl[0].src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
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

