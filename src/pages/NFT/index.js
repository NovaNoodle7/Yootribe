import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import ListNFTS from './ListNFTS';
import { getInitialNft } from '../../store/nftSlice';
import { useSelector } from 'react-redux';
import { PageHeader } from '../../components/PageHeader';
import { useLocation, useNavigate } from 'react-router-dom';

const NFTPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { state, pathname } = useLocation();
  const [currentTab, setCurrentTab] = useState('draft');
  const nftCounts = useSelector((state) => state.dashboard.counts.nfts);

  useEffect(() => {
    if (state && state.currentTab) {
      setCurrentTab(state?.currentTab);
      navigate(pathname, { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, currentTab]);
  
  useEffect(() => {
    dispatch(getInitialNft({}));
  }, []);

  const tabs = {
    draft: {
      name: 'Draft NFTS',
      count: nftCounts.draft
    },
    live: {
      name: 'Live NFTS',
      count: nftCounts.live
    },
    burned: {
      name: 'Burned NFTS',
      count: nftCounts.burned
    }
  };



  return (
    <main className="main">
      <PageHeader
        tabs={tabs}
        setCurrentTab={setCurrentTab}
        currentTab={currentTab}
        title="NFT IN THE MAKING"
        description="Re-invent your relationship with your customers, fans, leads...<br />Go beyond and have unforgettable experiences tied to your NFT and your target group."
      />

      <ListNFTS setCurrentTab={setCurrentTab} currentTab={currentTab} />
    </main>
  );
};

export default NFTPage;
