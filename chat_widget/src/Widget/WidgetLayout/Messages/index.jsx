import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { useScrollBottom } from "../../../hooks/useScrollBottom";
import AppContext from "../../AppContext";
import { BotTyping } from "./BotMessage/BotTyping";
import { Chats } from "./Chats";
// import "./index.css";
import {
  fetchBotResponse,
  setUserGreeted,
  setUserTypingPlaceholder,
  toggleBotTyping,
  toggleUserTyping,
} from "./messageSlice";

const MessagesDiv = styled.div`
  /* width */
  ::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: "transparent";
  }
  /* Handle */
  ::-webkit-scrollbar-thumb {
    border-radius: 20px;
    background-clip: "padding-box";
    background: ${(props) => props.widgetColor}; /* color of the scroll thumb */
    border-radius: "20px"; /* roundness of the scroll thumb */
    border: "none"; /* creates padding around scroll thumb */
  }
`;

export const Messages = () => {
  const dispatch = useDispatch();
  const appContext = useContext(AppContext);
  const { widgetColor, initialPayload, rasaServerUrl, userId, widgetbgColor, bgImage, bgTheme } = appContext;
  const { messages = [], userGreeted } = useSelector((state) => state.messageState); // Default to empty array
  // console.log("userGreeted=====>123", userGreeted);
  console.log("messages=====>123", messages);

  

  const agentIDToFilter = localStorage.getItem("agent_id"); // Filter messages with agentID "567"

  // Ensure `messages` is valid before applying `filter`
  const filteredMessages = Array.isArray(messages)
    ? messages.filter((message) => message.agentID && message.agentID === agentIDToFilter)
    : [];
  
  
  console.log("filteredMessages length===>", filteredMessages);

  const bottomRef = useScrollBottom(filteredMessages);


  useEffect(() => {
    if (!userGreeted && filteredMessages.length < 1) {
      dispatch(setUserGreeted(true));
      dispatch(setUserTypingPlaceholder("Please wait while bot is typing..."));
      dispatch(toggleBotTyping(true));
      dispatch(toggleUserTyping(false));
      dispatch(
        fetchBotResponse({
          rasaServerUrl,
          message: initialPayload,
          sender: localStorage.getItem("user_id"),
        })
      );
    } else {
      console.log("No need to greet the user");
     
    }
  }, [
    dispatch,
    initialPayload,
    filteredMessages.length,
    rasaServerUrl,
    userGreeted,
    userId,
  ]);

  const backgroundStyle =
    bgTheme === "img"
      ? { backgroundImage: `url(${bgImage})`, backgroundSize: "cover" }
      : { backgroundColor: widgetbgColor };

  return (
    <MessagesDiv
      className="absolute break-words top-[17%] flex h-[72%] w-full flex-col space-y-1 self-start overflow-y-auto rounded-t-[1.2rem] bg-white p-2 pt-2"
      widgetColor={widgetColor}
      style={backgroundStyle}
    >
      <Chats messages={filteredMessages} />
      <BotTyping />
      <div ref={bottomRef}></div>
    </MessagesDiv>
  );
};


// import { useContext, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import styled from "styled-components";
// import { useScrollBottom } from "../../../hooks/useScrollBottom";
// import AppContext from "../../AppContext";
// import { BotTyping } from "./BotMessage/BotTyping";
// import { Chats } from "./Chats";
// // import "./index.css";
// import {
//   fetchBotResponse,
//   setUserGreeted,
//   setUserTypingPlaceholder,
//   toggleBotTyping,
//   toggleUserTyping,
// } from "./messageSlice";

// const MessagesDiv = styled.div`
// /* width */
// ::-webkit-scrollbar {
//   width: 5px;
// }

// /* Track */
// ::-webkit-scrollbar-track {
//   background: "transparent"

// }
// /* Handle */
// ::-webkit-scrollbar-thumb {
  
//   border-radius:20px;
//   background-clip: "padding-box";
//   background: ${(props) => props.widgetColor}; /* color of the scroll thumb */,
//   border-radius: "20px"; /* roundness of the scroll thumb */,
//   border: "none"; /* creates padding around scroll thumb */,
// }
// `;
// export const Messages = () => {
//   const dispatch = useDispatch();
//   const appContext = useContext(AppContext);

//   const { widgetColor, initialPayload, rasaServerUrl, userId ,widgetbgColor,bgImage ,bgTheme} = appContext;
//   const { messages, userGreeted } = useSelector((state) => state.messageState);
//   console.log("messages=====>",messages)
//   const agentIDToFilter = localStorage.getItem("agent_id"); // Filter messages with agentID "567"
  
//     const filteredMessages = messages.filter(message => message.agentID && message.agentID === agentIDToFilter);
    
//     console.log("filteredMessages===>",filteredMessages)

//   const bottomRef = useScrollBottom(filteredMessages);
//   useEffect(() => {
//     if (!userGreeted && filteredMessages.length < 1) {
//       dispatch(setUserGreeted(true));
//       dispatch(setUserTypingPlaceholder("Please wait while bot is typing..."));
//       dispatch(toggleBotTyping(true));
//       dispatch(toggleUserTyping(false));
//       dispatch(
//         fetchBotResponse({
//           rasaServerUrl,
//           message: initialPayload,
//           sender: localStorage.getItem('user_id'),
//         })
//       );
//     }
//     else{
//       console.log("error")
//     }
//   }, [
//     dispatch,
//     initialPayload,
//     filteredMessages.length,
//     rasaServerUrl,
//     userGreeted,
//     userId,
//   ]);
//   const backgroundStyle = bgTheme === "img"
//   ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover' }
//   : { backgroundColor: widgetbgColor };

//   return (
//     <MessagesDiv
//       className="absolute break-words top-[17%] flex h-[72%] w-full flex-col space-y-1 self-start overflow-y-auto rounded-t-[1.2rem] bg-white p-2 pt-2"
//       widgetColor={widgetColor}
//       style={backgroundStyle}
//     >
      
//       <Chats messages={filteredMessages} />
//       <BotTyping />
//       <div ref={bottomRef}></div>
//     </MessagesDiv>
//   );
// };
