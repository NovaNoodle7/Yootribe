import React from 'react';

const Step3 = (props) => {
  const { setCreateWalletStep } = props;
  return (
    <div className={'create-wallet-inner'}>
      <div className="content-flex">
        <h1 className={'moved'}>
          I want my <span>NFT</span>
        </h1>
        <div className={'bordered-content with-image'}>
          <h4>Before you start backing up the wallet</h4>
          <p>
            The 12-24 word recovery phrase is a private key that you can use to regain access to
            your wallet if one or more connected devices are lost. Keep it in a safe place, and in
            the exact order it appears below.
          </p>
          <p>
            <span style={{ display: 'block' }}>&#x1F6A8;</span>
            Important: Never share your recovery phrase. Anyone with this phrase can permenantly
            take over your assets.
          </p>
        </div>
      </div>
      <button onClick={() => setCreateWalletStep(4)} className={'action-button'}>
        Next
      </button>
    </div>
  );
};

export default Step3;
