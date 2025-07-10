import React from 'react';
import { useSelector } from 'react-redux';
import NftsNavigation from './components/micro/NftsNavigation';

function ShowDraftNfts() {
  const user = useSelector((state) => state.auth.value.user);

  return (
    <div className="container-large">
      <div className="content-with-sidebar">
        {user.company !== null && user.company !== undefined ? <NftsNavigation /> : <div></div>}
        <div className="content">
        </div>
      </div>
    </div>
  );
}

export default ShowDraftNfts;
