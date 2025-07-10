import React from 'react';
import { useSelector } from 'react-redux';

import nftNav from '../../static/nft-sidebar.json';
import nftSteps from '../../static/nft-stepper.json';
import campaignNav from '../../static/campaign-sidebar.json';
import campaignSteps from '../../static/campaign-stepper.json';
import VerticalStepper from '../VerticalStepper';

const NftsNavigation = ({
  create = false,
  campaign = false,
  setCurrentTab,
  currentTab,
  kyc = false
}) => {
  const allCampaigns = useSelector((state) => state.campaigns);
  return (
    <aside>
      {!create && campaign && !kyc && (
        <div className="sidebar">
          <div className="nft-nav-buttons">
            {campaignNav.map((item, index) => {
              return (
                <button
                  key={index + 1}
                  className={currentTab === item.type ? 'active' : ''}
                  onClick={() => setCurrentTab(item.type)}>
                  {item.name}
                  <span className={'nft-count'}>
                    {item.type === 'draft' && allCampaigns.draft.length}
                    {item.type === 'live' && allCampaigns.live.length}
                    {item.type === 'whitelisted' && allCampaigns.whitelisted.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      {create && !campaign && !kyc && (
        <div className="sidebar">
          <h3>Create NFT</h3>
          <VerticalStepper currentTab={currentTab} steps={nftSteps} />
        </div>
      )}
      {create && campaign && !kyc && (
        <div className="sidebar">
          <h3>Create Campaign</h3>
          <VerticalStepper currentTab={currentTab} steps={campaignSteps} />
        </div>
      )}
      {!create && !campaign && kyc && (
        <div className="sidebar description">
          <h3>Important information</h3>
          <p>
            We take privacy and security very seriously. Our privacy policy explains how and for
            what purposes we collect, use, retain, disclose, and safeguard any personal data you
            provide to us.
          </p>
          <a href={'#'}>Any questions go to our FAQ</a>
        </div>
      )}
    </aside>
  );
};

export default NftsNavigation;
