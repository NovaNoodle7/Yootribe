import React from 'react';
import { ChannelList } from '@pubnub/react-chat-components';

const Channels = (props) => {
  const { groupChannels, setCurrentChannel } = props;
  return (
    <div className='channel-lists'>
      <h3>Community</h3>
      <div>
        <ChannelList
          channels={groupChannels}
          sort={() => {}}
          onChannelSwitched={(channel) => {
            setCurrentChannel(channel);
          }}
        />
      </div>
    </div>
  );
}


export default Channels;