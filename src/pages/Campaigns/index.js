import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInitialCampaigns } from '../../store/campaignSlice';
import { useLocation, useNavigate } from 'react-router-dom';

import DraftCampaign from './DraftCampaign';
import LiveCampaign from './LiveCampaign';
import WhitelistedCampaign from './WhitelistedCampaign';
import { PageHeader } from '../../components/PageHeader';

const CampaignPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isSuperUser = useSelector((state) => state.auth.value?.user?.is_superadmin);
  const campaignCounts = useSelector((state) => state.dashboard.counts.campaigns);

  const [currentTab, setCurrentTab] = useState('draft');
  const { state, pathname } = useLocation();

  useEffect(() => {
    if (state && state.currentTab) {
      setCurrentTab(state?.currentTab);
      navigate(pathname, { replace: true });
    }
  }, [state, currentTab]);

  useEffect(() => {
    dispatch(getInitialCampaigns({}));
  }, [dispatch]);

  const tabs = {
    draft: {
      title: 'Campaign listing (draft)',
      name: 'Draft Campaign',
      count: campaignCounts.draft,
    },
    live: {
      title: 'Campaign listing (live)',
      name: 'Live Campaign',
      count: campaignCounts.live,
    },
    whitelisted: {
      title: 'Campaign listing (whitelisted)',
      name: 'Whitelist results',
      count: campaignCounts.whitelisted,
    },
  };

  return (
    <main className="main main-compaign">
      <PageHeader
        tabs={!isSuperUser ? tabs : {}}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        title={tabs[currentTab]?.title}
        description={
          'Easily distribute your NFT via a simple interface.<br />Get more from your leads, provide them with a social portfolio that can dive into the Web3.'
        }
      />

      {currentTab === 'draft' && <DraftCampaign currentTab={currentTab} setCurrentTab={setCurrentTab} />}
      {currentTab === 'live' && <LiveCampaign currentTab={currentTab} setCurrentTab={setCurrentTab} />}
      {currentTab === 'whitelisted' && <WhitelistedCampaign currentTab={currentTab} setCurrentTab={setCurrentTab} />}
    </main>
  );
};

export default CampaignPage;
