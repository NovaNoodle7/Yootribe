import React from 'react';
import pickerData from "@emoji-mart/data";
import EmojiPicker from '@emoji-mart/react';
import {
  MessageInput,
  MessageList,
  TypingIndicator,
} from '@pubnub/react-chat-components';
import { MoonIcon, SunIcon } from '../../assets/icons';

const Messaging = (props) => {
  const { currentChannel, theme, setTheme } = props;

  return (
    <div className={'messaging-wrapper'}>
      <div className={'channel-name'}>
        <h3>{currentChannel?.name}</h3>
      </div>
      <div className={`theme-selector ${theme}`}>
        <button className={`${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>
          <MoonIcon />
        </button>
        <button className={`${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>
          <SunIcon />
        </button>
      </div>
      <MessageList
        fetchMessages={25}
        enableReactions
        reactionsPicker={<EmojiPicker data={pickerData} />}
      />
      <TypingIndicator />
      <MessageInput
        emojiPicker={<EmojiPicker data={pickerData} />}
        fileUpload={'image'}
      />
    </div>
  );
};


export default Messaging;
