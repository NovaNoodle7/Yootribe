import React, { useState } from 'react';

// Components
import DashContent from '../micro/DashContent';

const CreateNFTSubscriptions = ({ nftData, setNftData, handleDraftNft, setCurrentTab }) => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const [subscription, setSubscription] = useState(null);
  return (
    <DashContent>
      <div className="nft-content">
        <div className="container">
          <div className={'subscriptions'}>
            <div className={`single-subscription ${subscription === 1 ? 'active' : ''}`}>
              <h3>NFT PASS 1</h3>
              <p className={'price'}>$9,95/month</p>
              <p>1 user</p>
              <em>30 days free trial period</em>
              <button className="action-button" onClick={() => setSubscription(1)}>
                {subscription === 1 ? 'Selected' : 'Select'}
              </button>
            </div>
            <div className={`single-subscription ${subscription === 2 ? 'active' : ''}`}>
              <h3>NFT PASS 2</h3>
              <p className={'price'}>$19,95/month</p>
              <p>5 users</p>
              <em>30 days free trial period</em>
              <button className="action-button" onClick={() => setSubscription(2)}>
                {subscription === 2 ? 'Selected' : 'Select'}
              </button>
            </div>
            <div className={`single-subscription ${subscription === 3 ? 'active' : ''}`}>
              <h3>NFT PASS 3</h3>
              <p className={'price'}>$49,95/month</p>
              <p>100 users</p>
              <em>30 days free trial period</em>
              <button className="action-button" onClick={() => setSubscription(3)}>
                {subscription === 3 ? 'Selected' : 'Select'}
              </button>
            </div>
          </div>
          <div
            style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
            <button className="action-button primary" onClick={() => setCurrentTab('packs')}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </DashContent>
  );
};

export default CreateNFTSubscriptions;
