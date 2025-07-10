import React, { useState } from 'react';

// Components
import DashContent from '../micro/DashContent';

const CreateNFTPacks = ({ nftData, setNftData, handleDraftNft, setCurrentTab }) => {
  const [pack, setPack] = useState(null);
  return (
    <DashContent>
      <div className="nft-content">
        <div className="container">
          <h3>Choose your pack</h3>
          <div className={'subscriptions'}>
            <div className={`single-subscription ${pack === 1 ? 'active' : ''}`}>
              <h3>10 NFT</h3>
              <p>$ 250</p>
              <p>$25 / NFT</p>
              <button className="action-button" onClick={() => setPack(1)}>
                {pack === 1 ? 'Selected' : 'Select'}
              </button>
            </div>
            <div className={`single-subscription ${pack === 2 ? 'active' : ''}`}>
              <h3>50 NFT</h3>
              <p>$ 1250</p>
              <p>$25 / NFT</p>
              <button className="action-button" onClick={() => setPack(2)}>
                {pack === 2 ? 'Selected' : 'Select'}
              </button>
            </div>
            <div className={`single-subscription ${pack === 3 ? 'active' : ''}`}>
              <h3>100 NFT</h3>
              <p>$ 2500</p>
              <p>$25 / NFT</p>
              <button className="action-button" onClick={() => setPack(3)}>
                {pack === 3 ? 'Selected' : 'Select'}
              </button>
            </div>
          </div>
          <div
            style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
            <button className="action-button primary" onClick={() => setCurrentTab('payment')}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </DashContent>
  );
};

export default CreateNFTPacks;
