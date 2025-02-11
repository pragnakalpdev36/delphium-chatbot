
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getBotResponse } from "../../../utils/helpers";
// import { data } from "autoprefixer";
import { useState} from "react";
// import raw from "../../../../src/constant/test_res";

export const fetchBotResponse = createAsyncThunk(
  "messages/fetchBotResponse",
  async (payload, thunkAPI) => {
    console.log("payload::", payload);
    const response = await getBotResponse(payload);
    const newresponse = [{text:response.body}]
    console.log("bot response::-------", newresponse);
    await new Promise((r) => setTimeout(r, 1000));
  
    return newresponse;
  }
);

export const resetBot = createAsyncThunk(
  "messages/resetBot",
  async (payload, thunkAPI) => {
    console.log("reset payload---",payload);
    await getBotResponse(payload);
  }
);

const initialState = {

  botTyping: false,
  userTyping: true,
  userTypingPlaceholder: "Type your message here...",
  userGreeted: false,
};
export const messagesSlice = createSlice({
  name: "messages...",
  initialState,
  reducers: {
    addMessage: (state, action) => {
  
      if (action.payload.sender === "USER") {
        state.messages = state.messages.map((message) => {
          if (message.type === "custom") {
            // console.log("custom message")
            if (message.text) {
              message = {
                text: message.text,
                sender: "BOT",
                type: "text",
                ts: message.ts,
                agentID: localStorage.getItem("agent_id"),
              };
            }
          }
          if (message.type === "buttons") {
            message.quick_replies = [];
          }
          return message;
        });
      }
      state.messages.push(action.payload);
    },
    resetMessageState: () => {
      return initialState;
    },
    removeAllMessages: (state) => {
      state.messages = [];
    },
    disableButtons: (state, action) => {
      const index = action.payload;
      state.messages[index].callback = false;
    },
    toggleUserTyping: (state, action) => {
      state.userTyping = action.payload;
    },
    toggleBotTyping: (state, action) => {
      state.botTyping = action.payload;
      state.userTypingPlaceholder = action.payload
        ? "Please wait for bot response..."
        : "Type your message here...";
    },
    setUserTypingPlaceholder: (state, action) => {
      state.userTypingPlaceholder = action.payload;
    },
    setUserGreeted: (state, action) => {
      state.userGreeted = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBotResponse.fulfilled, (state, action) => {
      state.botTyping = false;
      state.userTyping = true;
      state.userTypingPlaceholder = "Type your message here...";
      const messages = action.payload;
      console.log("Message=----", messages);
      
      if (!Array.isArray(state.messages)) {
        state.messages = []; // Initialize as an empty array if undefined
      }

      if (messages.length > 0) {
        console.log("Message++++", messages);
        for (let index = 0; index < messages.length; index += 1) {
          const message = messages[index];
          // messageType: text
          if (message?.text) {
            // console.log("text-----", message)
            state.messages.push({
              text: message.text,
              sender: "BOT",
              type: "text",
              ts: new Date(),
              agentID: localStorage.getItem("agent_id"),
            });
            console.log("message----->",message)
          }

          // messageType: image
          if (message?.image) {
            // console.log("image :")
            state.messages.push({
              text:message.text,
              src: message.image,
              sender: "BOT",
              type: "image",
              ts: new Date(),
              agentID: localStorage.getItem("agent_id"),
            });
          }

          // messageType: buttons
          if (message?.buttons) {
            if (message.buttons.length > 0) {
              // console.log("buttons")
              state.messages.push({
                text:message.text,
                buttons: message.buttons,
                sender: "BOT",
                type: "buttons",
                ts: new Date(),
                callback: true,
                agentID: localStorage.getItem("agent_id"),
              });
            }
          }


          // MessageType: video
          if (message?.video) {
            // console.log("video :");
            state.messages.push({
              text:message.text,
              src: message.video,
              sender: "BOT",
              type: "video",
              ts: new Date(),
              agentID: localStorage.getItem("agent_id"),
            });
          }

          // MessageType: suggestion chips
          if (message?.suggestionChips) {
            if (message.suggestionChips.length > 0) {
              // console.log("suggestionChips");
              state.messages.push({
                agentID: localStorage.getItem("agent_id"),
                text: message.text,
                suggestionChips: message.suggestionChips,
                sender: "BOT",
                type: "suggestionChips",
                ts: new Date(),
                callback: true,
              });
            }
          }
          // MessageType: date picker
          if (message?.datePicker) {
            // console.log("datePicker");
            state.messages.push({
              label: message.datePicker.label,
              minDate: message.datePicker.minDate,
              maxDate: message.datePicker.maxDate,
              sender: "BOT",
              type: "datePicker",
              ts: new Date(),
              agentID: localStorage.getItem("agent_id"),
            });
          }
          //MessageType: Carousel image
          if (message?.carousel) {
            // console.log("carousel",message.carousel);
            state.messages.push({
              text: message.text,
              images: message.carousel,
              // alt:message.carousel.alt,
              sender: "BOT",
              type: "carousel",
              ts: new Date(),
              agentID: localStorage.getItem("agent_id"),
            });
          }

        }
      } else {
        state.messages.push({
          // text: "Unfortunately, I'm having some problem. I would appreciate it if you could try again later",
          text:"Hi",
          sender: "BOT",
          type: "text",
          ts: new Date(),
          agentID: localStorage.getItem("agent_id")
        });
      }
    });
  },
});

export const {
  addMessage,
  removeAllMessages,
  toggleBotTyping,
  toggleUserTyping,
  setUserTypingPlaceholder,
  setUserGreeted,
  resetMessageState,
  disableButtons,
} = messagesSlice.actions;

export default messagesSlice.reducer;





