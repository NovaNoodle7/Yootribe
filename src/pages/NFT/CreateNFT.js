import React, { useContext, useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import { createNFT } from '../../store/nftSlice';
import { useNavigate } from 'react-router-dom';
import { ToastContext } from '../../context/ToastContext';

import CreateNFTInfo from '../../components/NFT/CreateInfo';
// import CreateNFTPricing from '../../components/NFT/CreatePricing';
import CreateNFTConfirmation from '../../components/NFT/CreateConfirmation';
import CreateNFTSubscriptions from '../../components/NFT/CreateSubscriptions';
import CreateNFTPacks from '../../components/NFT/CreatePacks';
// import CreateNFTPayment from '../../components/NFT/CreatePayment';

import { useSelector } from 'react-redux';
import { PageHeader } from '../../components/PageHeader';

const CreateNFT = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleToast } = useContext(ToastContext);

  const [currentTab, setCurrentTab] = useState('info');
  const [nftData, setNftData] = useState({});

  const handleDraftNft = async (nftVal) => {
    dispatch(createNFT(nftVal));
    navigate('/dashboard/nfts');
    handleToast(`Succesfully saved ${nftVal.name}`, 'success');
  };

  useEffect(() => {
    if (currentTab === 'finish') {
      const tempNFT = { ...nftData, status: 'ready', paid: true };
      dispatch(createNFT(tempNFT));
      navigate('/dashboard/nfts');
      handleToast(`Succesfully published ${tempNFT.name}`, 'success');
    }
  }, [currentTab]);

  const nftCounts = useSelector((state) => state.dashboard.counts.nfts);

  const tabs = {
    draft: {
      name: 'Draft NFTS',
      onClick: () => navigate('/dashboard/nfts'),
      count: nftCounts.draft
    },
    live: {
      name: 'Live NFTS',
      onClick: () => navigate('/dashboard/nfts'),
      count: nftCounts.live
    },
    info: {
      name: 'Create NFT (NFT Infos)',
      title: 'CREATE NFT',
      hidden: true
    },
    // pricing: {
    //   title: 'NFT PRICING',
    //   name: 'Create NFT (NFT Pricing)',
    //   hidden: true
    // },
    confirmation: {
      title: 'NFT PAYMENT',
      name: 'Create NFT (Confirmation)',
      hidden: true
    },
    subscription: {
      title: 'NFT SUBSCRIPITON',
      name: 'Create NFT (Subscription)',
      hidden: true
    },
    packs: {
      title: 'NFT PACKS',
      name: 'Create NFT (Packs)',
      hidden: true
    },
    // payment: {
    //   title: 'PAYMENT',
    //   name: 'Create NFT (Payment)',
    //   hidden: true
    // }
  };

  return (
    <main className="main">
      <PageHeader
        tabs={tabs}
        currentTab={currentTab}
        setCurrentTab={() => {}}
        title={tabs[currentTab]?.title}
        description="Re-invent your relationship with your customers, fans, leads...<br>Go beyond and have unforgettable experiences tied to your NFT and your target group."
      />

      {currentTab === 'info' && (
        <CreateNFTInfo
          nftData={nftData}
          setNftData={setNftData}
          handleDraftNft={handleDraftNft}
          setCurrentTab={setCurrentTab}
        />
      )}
      {/* {currentTab === 'pricing' && (
        <CreateNFTPricing
          nftData={nftData}
          setNftData={setNftData}
          handleDraftNft={handleDraftNft}
          setCurrentTab={setCurrentTab}
        />
      )} */}
      {currentTab === 'confirmation' && (
        <CreateNFTConfirmation
          nftData={nftData}
          setNftData={setNftData}
          handleDraftNft={handleDraftNft}
          setCurrentTab={setCurrentTab}
          typeConfirmation="insert"
        />
      )}
      {currentTab === 'subscription' && (
        <CreateNFTSubscriptions
          nftData={nftData}
          setNftData={setNftData}
          handleDraftNft={handleDraftNft}
          setCurrentTab={setCurrentTab}
        />
      )}
      {currentTab === 'packs' && (
        <CreateNFTPacks
          nftData={nftData}
          setNftData={setNftData}
          handleDraftNft={handleDraftNft}
          setCurrentTab={setCurrentTab}
        />
      )}
      {/* {currentTab === 'payment' && (
        <CreateNFTPayment
          nftData={nftData}
          setNftData={setNftData}
          handleDraftNft={handleDraftNft}
          setCurrentTab={setCurrentTab}
        />
      )} */}
    </main>
  );
};

export default CreateNFT;
