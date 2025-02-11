

import { useContext, useState } from "react";
import AppContext from "../../../AppContext";
import { formattedTs, MardownText } from "../utils";
import { Suggestions } from "./SuggestionChips";

export const TextMessage = ({
  text,
  startsSequence,
  endsSequence,
  showBotAvatar,
  // showTimestamp,
  ts,
}) => {
  const theme = useContext(AppContext);
  const { botAvatar, botMsgColor, botMsgBackgroundColor, timecolor,showTimestamp,botAvatarLogo } = theme;
  
  // const [showTimestamp, setShowTimestamp] = useState(true);

  const position = [
    "message",
    `${startsSequence ? "start" : ""}`,
    `${endsSequence ? "end" : ""}`,
  ]
    .join(" ")
    .trim();

  // Simplify border style logic
  let borderStyle = "rounded-tl-[5px] rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px]";
  if (position === "message start end" || position === "message start" || position === "message end") {
    borderStyle = "rounded-tl-[20px] rounded-br-[20px] rounded-tr-[20px] rounded-bl-[20px]";
  }

  return (
    <div className="flex float-start pl-2">
      { botAvatarLogo &&(
      <div className={`flex w-6 items-start mr-4`}>
        <img
          className={`h-6 w-6 rounded-full ${showBotAvatar ? "" : "hidden"}`}
          src={botAvatar}
          alt="Bot Logo"
        />
      </div>
    )}
      <div className="flex min-w-[10%] max-w-[73%] flex-col space-x-2">
        <div
          className={`hide-scrollbar overflow-auto text-sm ${borderStyle} whitespace-pre-line px-[15px] py-[8px] `}
          style={{ color: botMsgColor, backgroundColor: botMsgBackgroundColor }}
          dir="auto"
        >
          <MardownText text={text} />
        </div>
        {showTimestamp && (
          <div className={`text-[10px] italic`} style={{ color: timecolor }}>
            {formattedTs(ts)}
          </div>
        )} 
      </div>
    </div>
  );
};
