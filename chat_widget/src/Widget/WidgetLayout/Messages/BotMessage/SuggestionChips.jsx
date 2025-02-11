import { useContext, useState, useEffect } from "react";
import AppContext from "../../../AppContext";
import { formattedTs } from "../utils";
import { useDispatch } from "react-redux";
import { createUserMessage } from "../../../../utils/helpers";
import styled from "styled-components";
import {
  addMessage,
  disableButtons,
  fetchBotResponse,
  toggleBotTyping,
  toggleUserTyping,
} from "../messageSlice";

export const Button = styled.button`
  border-radius: ${(props) => props.borderRadius};
  border-width: ${(props) => props.borderWidth};
  border-color: ${(props) => props.borderColor};
  border-style: solid;
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => props.color};

  &:hover {
    background-color: ${(props) =>
      props.enableHover ? props.hoverBackgroundColor : "none"};
    color: ${(props) => (props.enableHover ? props.color : "none")};
    border: ${(props) =>
      props.enableHover
        ? `${props.hoverborderWidth} solid ${props.borderColor}`
        : "none"};
  }
`;

export const Suggestions = ({
  showBotAvatar,
  // showTimestamp,
  index,
  suggestionChips,
  ts,
  text,
  callback,
}) => {
  const appContext = useContext(AppContext);
  const { buttonsCss, botAvatar, rasaServerUrl, userId ,showTimestamp,timecolor,botAvatarLogo} = appContext;
  const dispatch = useDispatch();
  const [visibleChips, setVisibleChips] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleChips((prev) => {
        const nextIndex = prev.length;
        if (nextIndex < suggestionChips.length) {
          return [...prev, suggestionChips[nextIndex]];
        }
        clearInterval(interval);
        return prev;
      });
    }, 500); // Adjust the interval time as needed
    return () => clearInterval(interval);
  }, [suggestionChips]);

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
      <div className="flex min-w-[10%] max-w-[73%] flex-col space-x-2">
        <div
          className={`w-fit min-w-[10%] max-w-[75%] ml-4 self-start whitespace-pre-line break-words text-sm`}
        >
          {/* {text && <div className="text-sm  mb-1 flex">{text}</div>} */}
          <div className="flex gap-2 flex-wrap">
            {visibleChips.map((chip, idx) => (
              <div className="relative group" key={idx}>
                <Button
                  type="button"
                  className="  inline max-w-52 hover:bg-blue-500   overflow-ellipsis whitespace-nowrap overflow-hidden px-4 py-2 rounded-2xl text-xs"
                  backgroundColor={buttonsCss.backgroundColor}
              color={buttonsCss.color}
              borderRadius={buttonsCss.borderRadius}
              borderWidth={buttonsCss.borderWidth}
              hoverborderWidth={buttonsCss.hoverborderWidth}
              borderColor={buttonsCss.borderColor}
              
              hoverBackgroundColor={buttonsCss.hoverBackgroundColor}
             
                  onClick={async (e) => {
                    e.preventDefault();
                    if (callback) {
                      const { title, payload } = chip;
                      dispatch(disableButtons(index));
                      dispatch(addMessage(createUserMessage(title)));
                      dispatch(toggleBotTyping(true));
                      dispatch(toggleUserTyping(false));
                      dispatch(
                        fetchBotResponse({
                          rasaServerUrl,
                          message: title,
                          sender: localStorage.getItem('user_id'),
                        })
                      );
                    }
                  }}
                >
                  {chip.title}
                </Button>
                <div className="absolute bottom-full ml-24 left-1 transform -translate-x-1/4 mb-2 hidden group-hover:block w-72 bg-gray-700 text-white text-xs rounded-md p-2">
                  {chip.title}
                </div>
              </div>
            ))}
          </div>
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
