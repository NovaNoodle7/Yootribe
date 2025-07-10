import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import DashContent from '../../components/micro/DashContent';
import NFTTable from '../../components/NFTTable/NFTTable';
import NFTTableLiveDraft from '../../components/NFTTable/NFTTableLiveDraft';

import mailChimpIcon from '../../assets/img/mail-chanp.png';

const DraftNFT = ({ setCurrentTab, currentTab }) => {
  const navigate = useNavigate();
  const draftNfts = useSelector((state) => state.nft.nfts);

  const currentNFts = [...draftNfts]
    .filter((item) => {
      if (currentTab === 'draft') {
        return item.status !== 'live' && item.status !== 'ended';
      } else if (currentTab === 'live') {
        return item.status === 'live';
      } else if (currentTab === 'burned') {
        return item.status === 'ended';
      }

      return item.status === currentTab;
    })
    .sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );


  return (
    <DashContent>
      <div className={'nft-content'}>
        <div className="container">
          <div className={'create-listed'}>
            <div>{`${currentNFts?.length} NFTs listed`}</div>
            <button
              onClick={() => navigate('/dashboard/nfts/create/', { state: { currentTab } })}
              className={'action-button'}
            >
              <img src={mailChimpIcon} alt={'create-nft-icon'} />
              Create new NFT
            </button>
          </div>

          {currentTab === "draft" ?
            <div className="table-responsive">
              {currentNFts?.length > 0 ? (
                <NFTTable setCurrentTab={setCurrentTab} currentTab={currentTab} nftData={currentNFts} type={'draft'} />
              ) : (
                `Currently no listed NFT's`
              )}
            </div>
            :
            <div className="table-responsive">
              {currentNFts?.length > 0 ? (
                <NFTTableLiveDraft setCurrentTab={setCurrentTab} currentTab={currentTab} nftData={currentNFts} type={'draft'} />
              ) : (
                `Currently no listed NFT's`
              )}
            </div>
          }

        </div>
      </div>
    </DashContent>
  );
};

export default DraftNFT;
