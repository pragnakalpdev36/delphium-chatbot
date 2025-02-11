import { Buttons } from "./Buttons";
import { Image } from "./Image";
import { TextMessage } from "./TextMessage";
import { Video } from "./Video";
import { Suggestions } from "./SuggestionChips";
import {DatePickers} from "./DatePicker";
import React from 'react';
import {Carousel} from './Carousel_Img';
// import {UserMessage} from '../UserMessage/index'


export const BotMessage = ({
  messageItem,
  startsSequence,
  endsSequence,
  index,
}) => {
  const botResponse = [];

  let showBotAvatar = false;
  // let showTimestamp = true;


  if (endsSequence) {
    showBotAvatar = true;
    // showTimestamp = true;//set the timestamp 
  }
  if (messageItem.type === "text") {
    botResponse.push(
      <TextMessage
        startsSequence={startsSequence}
        endsSequence={endsSequence}
        showBotAvatar={showBotAvatar}
        // showTimestamp={showTimestamp}
        text={messageItem.text}
        key={`${index}_text`}
        ts={messageItem.ts}
      />
    );
  }
  if (messageItem.type === "buttons") {
    botResponse.push(
      <Buttons
        buttons={messageItem.buttons}
        key={`${index}_buttons`}
        showBotAvatar={showBotAvatar}
        // showTimestamp={showTimestamp}
        ts={messageItem.ts}
        index={index}
        text={messageItem.text} 
        callback={messageItem.callback}
        />
      );
    }
    if (messageItem.type === "suggestionChips") {
      botResponse.push(
        <Suggestions
          showBotAvatar={showBotAvatar}
          // showTimestamp={showTimestamp}
          suggestionChips={messageItem.suggestionChips}
          ts={messageItem.ts}
          key={`${index}_suggestions`}
          text={messageItem.text} 
          index={index}
          callback={messageItem.callback}
        />
      );
    }
  if (messageItem.type === "image") {
    botResponse.push(
      <Image
        showBotAvatar={showBotAvatar}
        // showTimestamp={showTimestamp}
        imageUrl={messageItem.src}
        ts={messageItem.ts}
        key={`${index}image`}
      />
    );
  }
  if (messageItem.type === "video") {
    botResponse.push(
      <Video
        showBotAvatar={showBotAvatar}
        // showTimestamp={showTimestamp}
        videoUrl={messageItem.src} 
        ts={messageItem.ts}
        key={`${index}video`}
        text={messageItem.text} 
      />
    );
  }

  if (messageItem.type === 'datePicker') {
    return (
      <DatePickers
        key={`${index}_datePicker`}
        text={messageItem.text}
        ts = {messageItem.ts}
        label={messageItem.label}
        minDate={messageItem.minDate}
        maxDate={messageItem.maxDate}
        showBotAvatar={showBotAvatar}
        // showTimestamp={showTimestamp}
        // onDateSelect={handleDateSelect}
      />
    );
  }

  if (messageItem.type === "carousel") {
    console.log("in carousel index",messageItem.images); 
    botResponse.push(
      <Carousel
        showBotAvatar={showBotAvatar}
        // showTimestamp={showTimestamp}
        imageUrl={messageItem.images} 
        ts={messageItem.ts}
        key={`${index}_carousel`}
        text={messageItem.text} 
      />
    );
  }

  return botResponse;
};
