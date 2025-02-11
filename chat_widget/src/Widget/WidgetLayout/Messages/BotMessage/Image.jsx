import { useContext } from "react";
import AppContext from "../../../AppContext";
import { formattedTs } from "../utils";

export const Image = ({ showBotAvatar, imageUrl, ts,text,
  // showTimestamp
 }) => {
  console.log("image text---",text);
  console.log("image url---",imageUrl[0].src);
  const appContext = useContext(AppContext);
  const { botAvatar,showTimestamp ,botAvatarLogo} = appContext;
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
      <div className="flex  flex-col space-y-1">
        <div
          className={`w-fit min-w-[10%] max-w-[75%] ml-4 self-start whitespace-pre-line  break-words text-sm`}
        >
           {text && <div className="text-sm mb-1">{text}</div>}
          <img className="rounded-xl h-40 w-40 shadow-sm" src={imageUrl[0].src}  />
        </div>
        {showTimestamp && (
          <div className="text-[10px] italic  text-gray-500">
            {formattedTs(ts)}
          </div>
        )}
      </div>
    </div>
  );
};
