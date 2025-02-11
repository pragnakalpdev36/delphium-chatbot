import { Bars3BottomRightIcon } from "@heroicons/react/24/outline";
import { useContext, useState  } from "react";
import AppContext from "../../AppContext";
import { motion } from "framer-motion";
import { useDetectClickOutside } from "../../../hooks/useDetectClickOutside";
import { useDispatch } from "react-redux";
import { setToggleWidget } from "../../widgetSlice";
import { v4 as uuidv4 } from 'uuid';

import {
  removeAllMessages,
  resetBot,
  resetMessageState,
  fetchBotResponse,
  setUserTypingPlaceholder,
  toggleBotTyping,
  toggleUserTyping,
} from "../Messages/messageSlice";
import { Icon } from "./Icons";

const dropdownMenu = [
  // {
  //   title: "Restart",
  // },
  {
    title: "Clear Chat",
  },
  {
    title: "Close",
  },
];

export const Header = (props) => {
  const dispatch = useDispatch();
  const appContext = useContext(AppContext);
  const {
    botSubTitle,
    botTitle,
    botAvatar,
    chatHeaderCss,
    rasaServerUrl,
    userId,
    metadata,
  } = appContext;
  
  const { textColor, backgroundColor, enableBotAvatarBorder } = chatHeaderCss;
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useDetectClickOutside({
    setShowModal: setShowDropdown,
  });

  const handleCloseButton = () => {
    dispatch(setToggleWidget(false));
    setShowDropdown(!showDropdown);
  };

  // let { userId, embedded } = props;
  // console.log(embedded);

// let userIdRef = useRef(userId);
// console.log("user Ref: " , userIdRef);

  const handleClearChatButton = () => {
    dispatch(removeAllMessages());
    dispatch(toggleBotTyping(false));
    dispatch(toggleUserTyping(true));
    dispatch(setUserTypingPlaceholder("Type you message..."));
    setShowDropdown(!showDropdown);

    // localStorage.removeItem('user_id')
    // const newUserId = uuidv4();
    // localStorage.setItem('user_id', newUserId);
    // console.log("user id:--",newUserId)
    // console.log("user id2222:--",localStorage.getItem('user_id'))
    // localStorage.getItem('user_id')
    const newUserId = localStorage.getItem('user_id')
    dispatch(
      fetchBotResponse({
        rasaServerUrl,
        message: "/reset",
        sender: newUserId,
        metadata,
      })
    );
    
  };

  // const [currentUserId, setCurrentUserId] = useState(null);
  const handleRestartButton = () => {
    dispatch(resetMessageState());
    setShowDropdown(!showDropdown);
    const newUserId = localStorage.getItem('user_id')
    // localStorage.removeItem('user_id')
    // const newUserId = uuidv4();
    // localStorage.setItem('user_id', newUserId);

    // const newUserId = `user_${Math.random().toString(36).substr(2, 9)}`;
    // setCurrentUserId(newUserId);

    // const userId_2 = window.ChatbotWidget?.userId || newUserId;
    // console.log("userId:22222222222 :-----", userId_2);

    dispatch(
      resetBot({
        rasaServerUrl,
        message: "",
        sender:newUserId,
        metadata,
      })
    );
  };
  return (
    <>
      <div
        className="relative flex h-[20%] cursor-default items-center space-x-4  rounded-t-[1.8rem]  p-2 shadow-lg drop-shadow"
        style={{ backgroundColor, color: textColor }}
      >
        <div
          className="shrink-0 rounded-full border-[1px] "
          style={{ borderColor: textColor, borderWidth: enableBotAvatarBorder }}
        >
          <img className="h-12 w-12 rounded-full" src={botAvatar} alt="Bot Logo" />
        </div>
        <div className="w-full ">
          <div className={`text-xl font-semibold antialiased ${textColor}`}>{botTitle}</div>
          <p className="text-xs ">{botSubTitle}</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.2 }}
          className="flex"
          onClick={() => {
            setShowDropdown(!showDropdown);
          }}
        >
          <Bars3BottomRightIcon className=" h-7 w-7 cursor-pointer" />
        </motion.div>
      </div>
      {showDropdown && (
        <div
          id="dropdown"
          className=" absolute cursor-pointer right-5 top-16 z-50 w-fit divide-y divide-gray-100 rounded-xl bg-white shadow-lg"
          ref={dropdownRef}
        >
          <ul
            className="rounded-lg py-1 text-sm"
            aria-labelledby="dropdownDefault"
            style={{
              backgroundColor,
              color: textColor,
              border: `1px solid ${textColor}`,
            }}
          >
            {dropdownMenu.map((item, idx) => {
              const { title } = item;
              return (
                <div
                  key={idx}
                  className="flex hover:opacity-70"
                  onClick={() => {
                    if (title === "Close") {
                      handleCloseButton();
                    }
                     else if (title === "Clear Chat") {
                      handleClearChatButton();
                    } else {
                      handleRestartButton();
                    }
                  }}
                >
                  <div className="flex items-center justify-center pl-2">
                    <Icon name={title} />
                  </div>
                  <div>
                    <span className="block py-2 px-2 ">{title}</span>
                  </div>
                </div>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
};
