import React, { useState, useEffect, useRef, useMemo } from 'react';
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import {
  Chat,
  useChannelMembers,
  useChannels,
  usePresence,
  useUserMemberships
} from '@pubnub/react-chat-components';
import Channels from './Channels';
import Messaging from './Messaging';
import chatChannels from '../../static/chat-channels.json';
import MemberListing from './MembersList';

import Modal from 'react-modal';
import { customStyles } from '../../context/ModalContext';
import { useSelector } from 'react-redux';

const ChatComponent = () => {
  const [theme, setTheme] = useState('dark');
  const user = useSelector((state) => state?.auth?.value?.user);
  const [currentChannel, setCurrentChannel] = useState(chatChannels[0]);
  const [presentUUIDs, setPresentUUIDs] = useState([]);

  const [startChat, setStartChat] = useState(false);
  const [username, setUsername] = useState('');
  const [showModal, setShowModal] = useState(false);

  const pubnub = useRef(null);

  const changeChannel = useMemo(() => {
    if (pubnub.current) {
      pubnub.current.hereNow({ channels: chatChannels.map((item) => item.id) }, (status, res) => {
        const tempRes = res.channels[currentChannel.id]?.occupants?.map((o) => o.uuid);
        setPresentUUIDs(tempRes);
      });
    }
  }, [currentChannel, pubnub.current])

  const getCurrentChatData = () => {
    pubnub.current.whereNow({ uuid: user.username }, (status, res) => {
      console.log(status);
      if (res.length) setCurrentChannel(res[0]);
    });
    setStartChat(true);
  }

  useEffect(() => {
    if (!user.username) setShowModal(true);
    else {
      pubnub.current = new PubNub({
        publishKey: process.env.REACT_APP_PUBNUB_PUBLISH,
        subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE,
        userId: user.username,
        autoNetworkDetection: true,
        restore: true
      });
      getCurrentChatData();
    }
  }, [user]);

  const confirmUsername = () => {
    pubnub.current = new PubNub({
      publishKey: process.env.REACT_APP_PUBNUB_PUBLISH,
      subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE,
      userId: username,
      autoNetworkDetection: true,
      restore: true
    });
    setShowModal(false);
  };

  return (
    <div className={'chat-wrapper'}>
      <Modal
        isOpen={showModal}
        style={customStyles}
      >
        <h2>Please enter your username</h2>
        <input type={'text'} value={username} onChange={(e) => setUsername(e.target.value)} />
        <button onClick={() => confirmUsername()} className={'action-button'}>Confirm</button>
      </Modal>
      {startChat ? (
        <PubNubProvider client={pubnub.current}>
          <Chat theme={theme} currentChannel={currentChannel.id}>
            <Messaging theme={theme} setTheme={setTheme} currentChannel={currentChannel} />
            <Channels setCurrentChannel={setCurrentChannel} groupChannels={chatChannels.filter((c) => c.id?.startsWith('space.'))} />
            <MemberListing theme={theme} memberList={presentUUIDs} />
          </Chat>
        </PubNubProvider>
      ) : (
        <h4>Loading</h4>
      )}
    </div>
  );
};

export default ChatComponent;
