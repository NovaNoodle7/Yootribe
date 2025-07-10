import React, { useState } from 'react';

const Step2 = (props) => {
  const { setCreateWalletStep } = props;
  const [policies, setPolicies] = useState({
    wallet: false,
    terms: false
  });

  const checkboxHandler = (e) => {
    console.log(e);
    setPolicies({
      ...policies,
      [e.target.name]: e.target.checked
    });
  };

  return (
    <div className={'create-wallet-inner'}>
      <div className="content-flex">
        <h1 className={'moved'}>
          I want my <span>NFT</span>
        </h1>
        <div onClick={() => setCreateWalletStep(2)} className={'bordered-content'}>
          <h4 style={{ textAlign: 'left' }}>
            Secured and very easy to use, your Yootribe wallet is just a few clicks away on
            collaborative journey having access to all the upcoming perks and privileges from brands
            sponsors &amp; friends.
          </h4>
          <div className={'checkbox'}>
            <input
              onChange={(e) => checkboxHandler(e)}
              id={'wallet'}
              type={'checkbox'}
              name={'wallet'}
              checked={policies.wallet}
            />
            <label htmlFor={'wallet'}>
              I understand that this is a wallet in my custody, and that I am soleley resposible for
              any associated funds, assets or accounts, and that I must take approoriate steps to
              secure, protect and safeguard my wallet. I understand that Yootribe CANNOT access my
              wallet or reverse transactions on my behalf, and that my recovery phrase is the ONLY
              way to regain access in the event of password loss, device theft or simmilar
              circumstances.
            </label>
          </div>
          <div className={'checkbox'}>
            <input
              onChange={(e) => checkboxHandler(e)}
              id={'terms'}
              type={'checkbox'}
              name={'terms'}
              checked={policies.terms}
            />
            <label htmlFor={'terms'}>I have read and agree to the terms of use</label>
          </div>
        </div>
      </div>
      <button
        disabled={policies.wallet !== true || policies.terms !== true}
        onClick={() => setCreateWalletStep(3)}
        className={'action-button'}>
        Validate
      </button>
    </div>
  );
};

export default Step2;
