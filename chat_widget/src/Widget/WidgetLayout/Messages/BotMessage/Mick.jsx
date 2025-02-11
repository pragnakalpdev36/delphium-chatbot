import React, { useState, useContext } from 'react';
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { createUserMessage } from "../../../utils/helpers";
import AppContext from "../../AppContext";
import {
  addMessage,
  fetchBotResponse,
  toggleBotTyping,
  toggleUserTyping,
} from "../Messages/messageSlice";

import Microphone from './Microphone'; // Import the Microphone component

const Textarea = styled.textarea`
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Keypad = () => {
  const dispatch = useDispatch();
  const theme = useContext(AppContext);
  const [userInput, setUserInput] = useState("");
  const userTypingPlaceholder = useSelector(
    (state) => state.messageState.userTypingPlaceholder
  );
  const userTyping = useSelector((state) => state.messageState.userTyping);
  const { rasaServerUrl, userId, bottombgcolor } = theme;

  const handleSubmit = async () => {
    if (userInput.length > 0) {
      dispatch(addMessage(createUserMessage(userInput.trim())));
      setUserInput("");
      dispatch(toggleUserTyping(false));
      dispatch(toggleBotTyping(true));
      dispatch(
        fetchBotResponse({
          rasaServerUrl,
          message: userInput.trim(),
          sender: localStorage.getItem('user_id'),
        })
      );
    }
  };

  return (
    <div className="mt-auto flex h-[12%] items-center rounded-b-[2rem] bg-slate-50"
      style={{ backgroundColor: `${bottombgcolor}` }}>
      <Textarea
        rows="1"
        className={`mx-4 ps-6 block w-full resize-none rounded-3xl p-2.5 text-sm text-gray-900 outline-none ${
          userTyping ? "cursor-text" : "cursor-not-allowed"
        }`}
        placeholder={userTyping ? userTypingPlaceholder : "Listening..."}
        value={userInput}
        onChange={(e) => {
          setUserInput(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
          }
        }}
        readOnly={!userTyping}
      />
      <Microphone userId={userId} rasaServerUrl={rasaServerUrl} /> {/* Use the Microphone component */}
      <button
        type="submit"
        className={`${userInput.trim().length > 1 ? "cursor-pointer" : "cursor-not-allowed"} inline-flex justify-center rounded-full p-2`}
        style={{ color: "black" }}
        onClick={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        
        <PaperAirplaneIcon className="h-6 w-6 -rotate-45 stroke-[1.1px]" />
      </button>
    </div>
  );
};

export default Keypad;

import React, { useState, useContext } from 'react';
import { PaperAirplaneIcon, PaperClipIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { createUserMessage } from "../../../utils/helpers";
import AppContext from "../../AppContext";
import {
  addMessage,
  fetchBotResponse,
  toggleBotTyping,
  toggleUserTyping,
} from "../Messages/messageSlice";
import Microphone from './Microphone'; // Import the Microphone component

const Textarea = styled.textarea`
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Keypad = () => {
  const dispatch = useDispatch();
  const theme = useContext(AppContext);
  const [userInput, setUserInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const userTypingPlaceholder = useSelector(
    (state) => state.messageState.userTypingPlaceholder
  );
  const userTyping = useSelector((state) => state.messageState.userTyping);
  const { rasaServerUrl, userId, bottombgcolor } = theme;

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (userInput.length > 0 || selectedFile) {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      formData.append("message", userInput.trim());
      formData.append("sender", localStorage.getItem('user_id'));

      dispatch(addMessage(createUserMessage(userInput.trim())));
      setUserInput("");
      setSelectedFile(null);
      dispatch(toggleUserTyping(false));
      dispatch(toggleBotTyping(true));
      dispatch(
        fetchBotResponse({
          rasaServerUrl,
          formData,
        })
      );
    }
  };

  return (
    <div className="mt-auto flex h-[12%] items-center rounded-b-[2rem] bg-slate-50"
      style={{ backgroundColor: `${bottombgcolor}` }}>
      <label htmlFor="file-upload" className="cursor-pointer mx-4">
        <PaperClipIcon className="h-6 w-6 text-gray-500" />
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <Textarea
        rows="1"
        className={`mx-4 ps-6 block w-full resize-none rounded-3xl p-2.5 text-sm text-gray-900 outline-none ${
          userTyping ? "cursor-text" : "cursor-not-allowed"
        }`}

        placeholder={userTyping ? userTypingPlaceholder : "Listening..."}
        value={userInput}
        onChange={(e) => {
          setUserInput(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
          }
        }}
        readOnly={!userTyping}
      />
      <Microphone userId={userId} rasaServerUrl={rasaServerUrl} /> {/* Use the Microphone component */}
      <button
        type="submit"
        className={`${userInput.trim().length > 1 || selectedFile ? "cursor-pointer" : "cursor-not-allowed"} inline-flex justify-center rounded-full p-2`}
        style={{ color: "black" }}
        onClick={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <PaperAirplaneIcon className="h-6 w-6 -rotate-45 stroke-[1.1px]" />
      </button>
    </div>
  );
};

export default Keypad;
