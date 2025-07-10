import React, { createContext, useEffect } from 'react';
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthUser } from '../store/authSlice';
import { getInitialCounts } from '../store/dashboardSlice';

const AppContext = createContext({});

const AppProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.value.user);
  const [fetchingUser, setFetchingUser] = React.useState(true);

  const pubnub = new PubNub({
    publishKey: process.env.REACT_APP_PUBNUB_PUBLISH,
    subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE,
    userId: user?.username ?? 'testing',
    autoNetworkDetection: true,
    restore: true
  });

  useEffect(() => {
    if (!user) {
      dispatch(
        getAuthUser({
          callback: () => setFetchingUser(false)
        })
      );
    }

    if (user) {
      setFetchingUser(false);
      dispatch(getInitialCounts({}));
    }
  }, [user, dispatch]);

  return (
    <AppContext.Provider value={{}}>
      <PubNubProvider client={pubnub}>{!fetchingUser && children}</PubNubProvider>
    </AppContext.Provider>
  );
};

export default AppProvider;
