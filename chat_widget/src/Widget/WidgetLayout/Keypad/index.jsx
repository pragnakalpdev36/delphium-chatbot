import React, { useRef, useState, useContext, useEffect } from 'react';
import { PaperAirplaneIcon, MicrophoneIcon, PaperClipIcon } from "@heroicons/react/24/outline";
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
  // const [recordedUrl, setRecordedUrl] = useState('');
  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);  // Used to store temporary text
  // const recognitionRef = useRef(null);
  // const silenceTimeoutRef = useRef(null);
  const apiKey = "39786858e8e1ef1b296f098bc9e6c991319a6984";
  const socketRef = useRef(null);
  // const [currentAudio, setCurrentAudio] = useState(null);
  const micRef = useRef(null); 
  let currentAudio=null

  const userTypingPlaceholder = useSelector(
    (state) => state.messageState.userTypingPlaceholder
  );

  const userTyping = useSelector((state) => state.messageState.userTyping);
  const { rasaServerUrl, userId, bottombgcolor, bgofInput, paddingaround } = theme;

  const [selectedFile, setSelectedFile] = useState(null);
  let silenceTimeoutRef = useRef(null);

  const handleFileChange = (e) => {
    console.log("file changed")
    setSelectedFile(e.target.files[0]);
    console.log("selected file changed",selectedFile);
  };

  const handleSubmit = async () => {
    if (userInput.length > 0) {
      const formData = new FormData();
      // if (selectedFile) {
      //   console.log("Please select", selectedFile)
      //   formData.append("file", selectedFile);
      // }
      // formData.append("message", userInput.trim());
      // formData.append("sender", localStorage.getItem('user_id'));

      dispatch(addMessage(createUserMessage(userInput.trim())));
      setUserInput("");
      dispatch(toggleUserTyping(false));
      dispatch(toggleBotTyping(true));
      dispatch(
        fetchBotResponse({
          rasaServerUrl,
          // formData,
          message: userInput.trim(),
          sender: localStorage.getItem('user_id'),
        })
      );
    }
  };

  // const handleSubmit = async () => {
  //   if (userInput.length > 0 || selectedFile) {
      // const formData = new FormData();
      // if (selectedFile) {
      //   formData.append("file", selectedFile);
      // }
      // formData.append("message", userInput.trim());
      // formData.append("sender", localStorage.getItem('user_id'));

  //     dispatch(addMessage(createUserMessage(userInput.trim())));
  //     setUserInput("");
  //     setSelectedFile(null);
  //     dispatch(toggleUserTyping(false));
  //     dispatch(toggleBotTyping(true));
  //     dispatch(
  //       fetchBotResponse({
  //         rasaServerUrl,
  //         formData,
  //       })
  //     );
  //   }
  // };

  const startRecording = async () => {
    setIsRecording(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio:true});

      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);

      chunks.current = [];  // Reset chunks

      // socketRef.current = new WebSocket("wss://api.deepgram.com/v1/listen", ["token", apiKey]);

      socketRef.current = new WebSocket("wss://api.deepgram.com/v1/listen?numerals=true&multichannel=true&interim_results=true&utterances=true&diarize=true&punctuate=true", ["token", apiKey]);

      socketRef.current.onopen = () => {
        mediaRecorder.current.ondataavailable = (e) => {
          if (e.data.size > 0 && socketRef.current.readyState === 1) {
            // console.log("currunt data :--",e.data);
            // chunks.current.push(e.data);
            socketRef.current.send(e.data);
          }
        };
        mediaRecorder.current.start(500);
      };

      
      socketRef.current.onmessage = async (message) =>
        {

          const received = JSON.parse(message.data);
          // console.log("received:------ ", received);
          
          let transcript = '';

        const transcript_chunk = received.channel.alternatives[0].transcript;
        if (transcript_chunk && received.is_final) {
            // transcript +=transcript_chunk+' '
             transcript =transcript_chunk+' '
            // setUserInput(transcript);
            console.log("transcript----", transcript)

          if (received.is_final) {
            console.log("ttttt-------", transcript);
            if (transcript!=''){
              // setUserInput(transcript);
              
              dispatch(addMessage(createUserMessage(transcript.trim())));
              setUserInput(transcript);
              setTimeout(() => {
                setUserInput("");
                // dispatch(addMessage(createUserMessage(transcript.trim())));
              }, 1000); 
            }

            // Make API call for the chatbot response

            try {
              console.log("url----",rasaServerUrl)
              // if (transcript!=''){

                
                const response = dispatch(
                  fetchBotResponse({
                    rasaServerUrl,
                    message: transcript.trim(),
                    sender: localStorage.getItem('user_id'),
                  })
                )
                .then(response => {
                  const text = response.payload[0].text;
                  // setUserInput("");
                  transcript=''

                  if (currentAudio) {
                    currentAudio.close();
                    currentAudio = null;
                }
                  // setResponseText(text);

                  fetch(`https://api.deepgram.com/v1/speak?model=aura-luna-en`, {
                    method: 'POST',
                    headers: {
                      'Authorization': `Token ${apiKey}`,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ text: text }),
                  })
                  
                    .then(res => res.blob())
                    .then(blob => {
                      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                      const source = audioContext.createBufferSource();
                      blob.arrayBuffer().then(buffer => {
    
                        audioContext.decodeAudioData(buffer, decodedData => {
                          source.buffer = decodedData;
                          source.connect(audioContext.destination);

                          // if (currentAudio) {
                          //   currentAudio.close();
                          //   setCurrentAudio(null);
                          // }
                          source.start(0);
                          // setCurrentAudio(audioContext);
                          currentAudio=audioContext;
                          console.log("Audio-+++:::",currentAudio)
    
    
    
                          source.onended = () => {
                            audioContext.close();
                            currentAudio = null;
                            // setCurrentAudio(null);
                          };
                        });
                      });
                    })
                    .catch(error => {
                      console.error('Error fetching or playing Deepgram TTS:', error);
                    });
                  // console.log("response:kkkk:::: ", text);
                })
                .catch(error => {
                  console.error("Error fetching bot response: ", error);
                });
                
            } catch (error) {
              console.error('Error fetching chatbot response:', error);
            }
            
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = setTimeout(() => {
              stopRecording();
            }, 2000);
            // setUserInput("");
            // clearTimeout(silenceTimeoutRef.current);
          }
        }
      };

      socketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        // Check if micRef is set before accessing it
        if (micRef.current) {
          micRef.current.classList.remove("recording");
        }
    
      };
      
      socketRef.current.onclose = () => {
        // setUserInput("");
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
          mediaRecorder.current.stop();
        }
           
        if (mediaStream.current) {
          mediaStream.current.getTracks().forEach((track) => {
            track.stop();
          });
        }
      };
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }

    
  };

  // const stopRecording = () => {
  //   if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
  //     mediaRecorder.current.stop();
  //   }
       
  //   if (mediaStream.current) {
  //     mediaStream.current.getTracks().forEach((track) => {
  //       track.stop();
  //     });
  //   }
  // if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
  //   socketRef.current.close();
  // }
  // if (currentAudio) {
  //   currentAudio.close();
  //   currentAudio = null;
  //   // setCurrentAudio(null);
  // }
  //   if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
  //     mediaRecorder.current.stop();
  //   }
  //   if (mediaStream.current) {
  //     mediaStream.current.getTracks().forEach((track) => {
  //       track.stop();
  //     });
  //   }
    
  //   setIsRecording(false);
  // };

  const stopRecording = () => {
    clearTimeout(silenceTimeoutRef.current);

    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
    }

    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => track.stop());
    }

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }

    if (currentAudio) {
      currentAudio.close();
      currentAudio = null;
    }

    setIsRecording(false);
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
          {/* <button
        type="button"
        className="ml-4 cursor-pointer inline-flex justify-center rounded-full"
        style={{ color: "black" }}
      >
        <PaperClipIcon className="h-6 w-6" />
      </button> */}
       {/* <label htmlFor="file-upload" className="cursor-pointer mx-4">
        <PaperClipIcon className="h-6 w-6 text-gray-500" />
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      /> */}
      <Textarea
        rows="1"
        className={`mx-4 ps-6 block w-full resize-none rounded-3xl p-2.5 text-gray-900 outline-none ${
          userTyping ? "cursor-text" : "cursor-not-allowed"
        }`}
        // placeholder={userTypingPlaceholder}
        placeholder={isRecording ? "Listening..." : userTypingPlaceholder}
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
      {/* <button
        type="button"
        className={`${isRecording ? "bg-red-500" : "bg-gray-500"} inline-flex justify-center rounded-full p-2 mx-2`}
        style={{ color: "white" }}
        onClick={handleMicClick}
      >
        <MicrophoneIcon className="h-6 w-6" />
      </button> */}
      <button
        type="submit"
        className={`${userInput.trim().length > 1 ? "cursor-pointer" : "cursor-not-allowed"} inline-flex justify-center rounded-full p-2 mb-[10px]`}
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


