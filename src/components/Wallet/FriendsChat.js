import { useRef, useState } from 'react';
import { SmileyIcon, AttachmentIcon } from '../../assets/icons';

import useComponentVisible from '../../hooks/useComponentVisible';
import SmileyBox from '../micro/SmileyBox';
import FriendMessage from './FriendMessage';
import UserMessage from './UserMessage';

const FriendsChat = (props) => {
  const { usersChat } = props;

  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

  const [input, setInput] = useState('');
  const fileInput = useRef(null);

  return (
    <div className={'wallet-chat'}>
      <div className={'users-chat-wrapper'}>
        {usersChat.map((data, i) => {
          if (data.message_type === 'received') {
            return (
              <UserMessage key={data.name} data={data} />
            );
          } else {
            return (
              <FriendMessage key={data.name} data={data} />
            );
          }
        })}
      </div>
      <div className={'user-input'}>
        {isComponentVisible && (
          <SmileyBox ref={ref} input={input} setInput={setInput} />
        )}
        <input type={'file'} hidden ref={fileInput} />
        <input type={'text'} value={input} onChange={(e) => setInput(e.target.value)} placeholder={'Type something to send...'} />
        <div className={'input-buttons'}>
          <button onClick={() => fileInput.current.click()}><AttachmentIcon /></button>
          <button onClick={() => setIsComponentVisible(!isComponentVisible)}><SmileyIcon /></button>
        </div>
      </div>
    </div>
  );
};

export default FriendsChat;
