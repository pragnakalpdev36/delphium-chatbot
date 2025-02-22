import { useContext } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { createUserMessage } from "../../../../utils/helpers";
import AppContext from "../../../AppContext";
import {
  addMessage,
  disableButtons,
  fetchBotResponse,
  toggleBotTyping,
  toggleUserTyping,
} from "../messageSlice";
import { formattedTs } from "../utils";

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

export const Buttons = ({ buttons, index, showBotAvatar, ts, callback,
  // showTimestamp 
}) => {
  const dispatch = useDispatch();
  const appContext = useContext(AppContext);
  const { buttonsCss, botAvatar, rasaServerUrl, userId ,showTimestamp,botAvatarLogo} = appContext;
  return (
    <div className="flex space-x-1 ">
      { botAvatarLogo &&(
      <div className={`flex w-5 items-start`}>
        <img
          className={`h-5 w-5  rounded-full ${showBotAvatar ? "" : "hidden"}`}
          src={botAvatar}
          alt="Bot Logo"
        />
      </div>
      )}
      <div className="flex  flex-col space-y-1">
        <div
          className={`mt-2 flex w-80 flex-wrap  gap-2 self-start whitespace-pre-line  break-words text-sm `}
        >

          {buttons.map((item, idx) => (
            <Button
              type="button"
              key={idx}
              className="px-3 py-2 bg-blue-300 rounded-2xl   hover:bg-blue-500 text-center text-sm font-medium "
              backgroundColor={buttonsCss.backgroundColor}
              color={buttonsCss.color}
              borderRadius={buttonsCss.borderRadius}
              borderWidth={buttonsCss.borderWidth}
              hoverborderWidth={buttonsCss.hoverborderWidth}
              borderColor={buttonsCss.borderColor}
              enableHover={buttonsCss.enableHover}
              hoverBackgroundColor={buttonsCss.hoverBackgroundColor}
              onClick={async (e) => {
                e.preventDefault();
                if (callback) {
                  const { title, payload } = item;
                  dispatch(disableButtons(index));
                  dispatch(addMessage(createUserMessage(title)));
                  dispatch(toggleBotTyping(true));
                  dispatch(toggleUserTyping(false));
                  dispatch(
                    fetchBotResponse({
                      rasaServerUrl,
                      message: payload,
                      sender: userId,
                    })
                  );
                }
              }}
            >
              {item.title}
            </Button>
          ))}
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
