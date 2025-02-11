import React, { useState, useRef } from 'react';
import { useDispatch } from "react-redux";
import { MicrophoneIcon } from "@heroicons/react/24/outline";
import { createUserMessage } from "../../../utils/helpers";
import {
  addMessage,
  fetchBotResponse,
} from "../Messages/messageSlice";
import AppContext from "../../AppContext";

const Microphone = ({ userId, rasaServerUrl }) => {
  const dispatch = useDispatch();
  const apiKey = "39786858e8e1ef1b296f098bc9e6c991319a6984";
  const [isRecording, setIsRecording] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const socketRef = useRef(null);
  const micRef = useRef(null);

  const startRecording = async () => {
    setIsRecording(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);

      socketRef.current = new WebSocket("wss://api.deepgram.com/v1/listen?numerals=true&multichannel=true&interim_results=true&utterances=true&diarize=true&punctuate=true", ["token", apiKey]);

      socketRef.current.onopen = () => {
        mediaRecorder.current.ondataavailable = (e) => {
          if (e.data.size > 0 && socketRef.current.readyState === 1) {
            socketRef.current.send(e.data);
          }
        };
        mediaRecorder.current.start(500);
      };

      socketRef.current.onmessage = async (message) => {
        const received = JSON.parse(message.data);
        // console.log("received:------ ", received);
        let transcript = '';

        const transcript_chunk = received.channel.alternatives[0].transcript;
        if (transcript_chunk && received.is_final) {
          transcript = transcript_chunk + ' ';
          console.log("transcript;;;;;;",transcript);

          if (received.is_final) {
            if (transcript !== '') {
              dispatch(addMessage(createUserMessage(transcript.trim())));

              try {
                const response = await dispatch(
                  fetchBotResponse({
                    rasaServerUrl,
                    message: transcript.trim(),
                    sender: localStorage.getItem('user_id'),
                  })
                );

                const text = response.payload[0].text;

                if (currentAudio) {
                  currentAudio.close();
                  setCurrentAudio(null);
                }

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
                        source.start(0);
                        setCurrentAudio(audioContext);

                        source.onended = () => {
                          audioContext.close();
                          setCurrentAudio(null);
                        };
                      });
                    });
                  })
                  .catch(error => {
                    console.error('Error fetching or playing Deepgram TTS:', error);
                  });
              } catch (error) {
                console.error("Error fetching bot response: ", error);
              }
            }
          }
        }
      };

      socketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        if (micRef.current) {
          micRef.current.classList.remove("recording");
        }
      };

      socketRef.current.onclose = () => {
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

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
    }

    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }
    if (currentAudio) {
      currentAudio.close();
      setCurrentAudio(null);
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
    <button
      type="button"
      className={`${isRecording ? "bg-red-500" : "bg-gray-500"} inline-flex justify-center rounded-full p-2 mx-2`}
      style={{ color: "white" }}
      onClick={handleMicClick}
      ref={micRef}
    >
      <MicrophoneIcon className="h-6 w-6" />
    </button>
  );
};

export default Microphone;
