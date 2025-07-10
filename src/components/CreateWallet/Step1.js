import React from 'react';

import createWalletIcon from '../../assets/img/connect-wallet-icon.png';

const Step1 = (props) => {
  return (
    <div style={{ width: 'auto' }} className={'create-wallet-inner'}>
      <h1>
        I want my <span>NFT</span>
      </h1>
      <div className={'create-wallet-reimagine'}>
        <h2>Reimagine your relationship with brands</h2>
        <h3>Go beyond and have unforgettable experience tied to your NFT ownership.</h3>
      </div>
      <div
        onClick={() => window.location.replace('/auth/register/wallet')}
        className={'bordered-content'}
        style={{ cursor: 'pointer' }}>
        <div className={'inner'}>
          <img src={createWalletIcon} alt={'create-wallet'} />
          <h2>Create your Yootribe wallet</h2>
        </div>
      </div>
    </div>
  );
};

export default Step1;
