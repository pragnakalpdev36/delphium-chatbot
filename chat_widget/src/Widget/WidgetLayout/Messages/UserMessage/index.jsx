import { useContext, useState  } from "react";

import AppContext from "../../../AppContext";

import { formattedTs, MardownText } from "../utils";

export const UserTextmessage = ({ messageItem}) => {
  // console.log("UserTextMessage====",messageItem);
  const { text, ts } = messageItem;
  const appContext = useContext(AppContext);
  const { textColor, userMsgBackgroundColor,timecolor,showTimestamp,userAvatarLogo } = appContext;

  // const [showTimestamp, setShowTimestamp] = useState(true);
  return (
    <div className=" flex flex-row-reverse" >
        {userAvatarLogo &&(
      <div className={`flex w-6 right-0 py-5 mx-3`}> 
      <img
          className={`h-6 w-6  rounded-full float-right `}
          src="https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/3_avatar-64.png"
          alt="Bot Logo"
        />
        </div>
        
        )}
      <div className="mt-4 mb-2 flex max-w-[73%] flex-col items-end justify-end ">
        <div
          className="items-end break-words rounded-t-[20px] rounded-br-[20px] rounded-bl-[20px] border-[0.5px]  px-[10px] py-[6px] text-sm "
          style={{ color: textColor, backgroundColor: userMsgBackgroundColor}}
          // style={{ color:"red"}}
        > 
          <MardownText text={text} />
        </div>

        {showTimestamp && (
        <div className={`text-[10px] pr-3 italic  ${timecolor} `}>
          {formattedTs(ts)}
        </div>
        )}
      </div>
    </div>
  );
};
