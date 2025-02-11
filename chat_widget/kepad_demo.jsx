
import React, { useRef, useState, useContext, useEffect } from 'react';
import { PaperAirplaneIcon, MicrophoneIcon } from "@heroicons/react/24/outline";
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
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState('');
  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const recognitionRef = useRef(null);
  const silenceTimeoutRef = useRef(null);

  const userTypingPlaceholder = useSelector(
    (state) => state.messageState.userTypingPlaceholder
  );

  const userTyping = useSelector((state) => state.messageState.userTyping);
  const { rasaServerUrl, userId, bottombgcolor, bgofInput, paddingaround } = theme;

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const recordedBlob = new Blob(chunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(recordedBlob);
        setRecordedUrl(url);
        chunks.current = [];
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      startSpeechRecognition();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
    stopSpeechRecognition();
    setIsRecording(false);
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setUserInput(finalTranscript || interimTranscript);
      dispatch(toggleUserTyping(true));
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = setTimeout(() => {
        handleSubmit();
      }, 1000);
    };

    recognition.start();
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    clearTimeout(silenceTimeoutRef.current);
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
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
        placeholder={userTypingPlaceholder}
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
      <button
        type="button"
        className={`${isRecording ? "bg-red-500" : "bg-gray-500"} inline-flex justify-center rounded-full p-2 mx-2`}
        style={{ color: "white" }}
        onClick={handleMicClick}
      >
        <MicrophoneIcon className="h-6 w-6" />
      </button>
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


// import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
// import { useContext, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import styled from "styled-components";
// import { createUserMessage } from "../../../utils/helpers";
// import AppContext from "../../AppContext";
// import {
//   addMessage,
//   fetchBotResponse,
//   toggleBotTyping,
//   toggleUserTyping,
// } from "../Messages/messageSlice";

// const Textarea = styled.textarea`
//   -ms-overflow-style: none;
//   scrollbar-width: none;
//   &::-webkit-scrollbar {
//     display: none;
//   }
// `;

// export const Keypad = () => {
//   const dispatch = useDispatch();
//   const theme = useContext(AppContext);
//   const [userInput, setUserInput] = useState("");
//   const userTypingPlaceholder = useSelector(
//     (state) => state.messageState.userTypingPlaceholder
//   );

//   const userTyping = useSelector((state) => state.messageState.userTyping);
//   const {  rasaServerUrl, userId, bottombgcolor,bgofInput,paddingaround } = theme;

//   const handleSubmit = async () => {
//     if (userInput.length > 0) {
//       dispatch(addMessage(createUserMessage(userInput.trim())));
//       setUserInput("");
//       dispatch(toggleUserTyping(false));
//       dispatch(toggleBotTyping(true));
//       dispatch(
//         fetchBotResponse({
//           rasaServerUrl,
//           message: userInput.trim(),
//           sender: localStorage.getItem('user_id'),
//         })
//       );
//     }
//   };

//   return (
//     <div className="mt-auto flex  h-[12%] items-center rounded-b-[2rem]  bg-slate-50"
//     style={{ backgroundColor : `${bottombgcolor}`}}>
//       <Textarea
//         rows="1"
//         className={` mx-4 ps-6 block w-full resize-none rounded-3xl p-2.5 text-sm text-gray-900 outline-none ${
//           userTyping ? "cursor-text" : "cursor-not-allowed"
//         }`}
//         placeholder={userTypingPlaceholder}
//         value={userInput}
//         onChange={(e) => {
//           setUserInput(e.target.value);
//         }}
//         onKeyDown={(e) => {
//           if (e.key === "Enter") {
//             e.preventDefault();
//             handleSubmit();
//           }
//         }}
//         readOnly={!userTyping}
//       />
//       <button
//         type="submit"
//         className={`${
//           userInput.trim().length > 1 ? "cursor-pointer" : "cursor-not-allowed"
//         } inline-flex justify-center rounded-full  p-2 `}
//         style={{ color: "black" }}
//         onClick={(e) => {
//           e.preventDefault();
//           handleSubmit();
//         }}
//       >
//         <PaperAirplaneIcon className="h-6 w-6 -rotate-45 stroke-[1.1px]" />
//       </button>
//     </div>
//   );
// };