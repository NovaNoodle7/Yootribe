import { useState } from 'react';
import SmileyBox from '../micro/SmileyBox';

import DummyImage from '../../assets/img/user-icon.png';
import { ShareIcon, SmileyIcon } from '../../assets/icons';
import useComponentVisible from '../../hooks/useComponentVisible';

const FriendMessage = (props) => {
  const { data } = props;
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  return (
    <div id="singleMessage" className={'friend-chat-received single-message'}>
      <div class={'image-user-text'}>
        <img className={'user-image'} src={DummyImage} alt={'user'} /> {/* User Image: // */}
        <h4 className={'user-name'}>{data.name}</h4> {/* UserName: // */}
        <span className={'sended'}>{new Date(data.time_sent).toLocaleString()}</span> {/* Time Sended: //  */}
      </div>
      <div className={'chat-message'}>
        <div className={'message'}>
          <p>{data.message}</p>
        </div>
        <div className={'message-icons'}>
          {isComponentVisible && (
            <SmileyBox ref={ref} input={''} setInput={() => {}} />
          )}
          <button onClick={() => setIsComponentVisible((prev) => !prev)}>
            <SmileyIcon />
          </button>
          <button>
            <ShareIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendMessage;
