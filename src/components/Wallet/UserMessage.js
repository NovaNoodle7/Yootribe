import { useState } from 'react';
import useComponentVisible from '../../hooks/useComponentVisible';

import SmileyBox from '../micro/SmileyBox';
import { SmileyIcon, ShareIcon, XIconLight } from '../../assets/icons';

import DummyImage from '../../assets/img/user-icon.png';

const UserMessage = (props) => {
  const { data } = props;
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  return (
    <div id="singleMessage" className={'friend-chat-sent single-message'}>
      <div class={'image-user-text'}>
        <img className={'user-image'} src={DummyImage} alt={'user'} />
        <h4 className={'user-name'}>{data.name}</h4>
        <span className={'sended'}>{new Date(data.time_sent).toLocaleString()}</span>
      </div>
      <div className={'chat-message'}>
        <div className={'message-icons'}>
          {isComponentVisible && (
            <SmileyBox ref={ref} input={''} setInput={() => {}} />
          )}
          <button onClick={() => setIsComponentVisible(!isComponentVisible)}>
            <SmileyIcon />
          </button>
          <button>
            <ShareIcon />
          </button>
          <button>
            <XIconLight />
          </button>
        </div>
        <div className={'message'}>
          <p>{data.message}</p>
        </div>
      </div>
    </div>
  );
};

export default UserMessage;
