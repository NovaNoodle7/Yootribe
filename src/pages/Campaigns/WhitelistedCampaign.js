import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import DashContent from '../../components/micro/DashContent';
import CampaignTable from '../../components/CampaignTable/CampaignTable';

import mailChimpIcon from '../../assets/img/mail-chanp.png';

const WhitelistedCampaign = ({ setCurrentTab, currentTab }) => {
  const navigate = useNavigate();
  const whitelistedCampaigns = useSelector((state) => state.campaigns.whitelisted);

  const data = [...whitelistedCampaigns].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <DashContent>
      <div className={'nft-content'}>
        <div className="container">
          <div className={'create-listed'}>
            {`${whitelistedCampaigns?.length} whitelisted campaigns listed`}
            <button
              onClick={() => navigate('/dashboard/campaigns/create', { state: { currentTab } })}
              className={'action-button'}
            >
              <img src={mailChimpIcon} alt={'create-nft-icon'} />
              Create new campaign
            </button>
          </div>
          <div className="table-responsive">
            {whitelistedCampaigns.length > 0 ? (
              <CampaignTable
                setCurrentTab={setCurrentTab}
                currentTab={currentTab}
                nftData={data}
                type={'whitelisted'}
              />
            ) : (
              `Currently no listed Campaigns`
            )}
          </div>
        </div>
      </div>
    </DashContent>
  );
};

export default WhitelistedCampaign;
