
import React, { useContext, useState, useEffect } from 'react';
import { ToastContext } from '../../context/ToastContext';


// ICONS

import CalendarIcon from '../../assets/img/calendar.png';
import { EthIcon } from '../../assets/icons';
import Tooltip from '../Tooltip';
import {getKeywordById} from "../../api";

const SingleCampaign = (props) => {
  const { campaign, currentETHPrice, nfts } = props;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const nth = (d) => {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }
  const date = new Date(campaign.ends_at);

  const [campaignData, setCampaignData] = useState({});


  useEffect(() => {
    const tempCampaign = nfts.find((item) => item._id === campaign.nft_id);
    if (tempCampaign) setCampaignData(tempCampaign);
  }, [campaign, nfts]);


  return (
    <div className={'single-wallet-campaign'}>
      <div className={'campaign-logo'}>
        {campaign.cover && <img src={`${process.env.REACT_APP_API}/uploads/${campaign.cover}`} alt={'uploaded'} />}
      </div>
      <div className={'campaign-content'}>
        <h3>{campaign.name}</h3>
        <div
          className={'campaign-content-html'}
          dangerouslySetInnerHTML={{
            __html: campaign.content.length > 541 ? campaign.content.substring(0, 541) + '...' : campaign.content,
          }}
        />
        <div className={'campaign-data'}>
          <div className={'campaign-tags'}>
            {campaign.keyword_ids.length > 0 &&
              campaign.keyword_ids.map((item, index) => {
                getKeywordById(item).then((res) => {
                  return (
                    <span key={index + 1} className={'single-tag'}>
                      # {res.keyword.word}
                    </span>
                  );
                });
              })}
          </div>
          <div className={'campaign-expiry-date'}>
            <Tooltip text={'Your campaign will end on this date.'}>
              <div className={'campaign-date'}>
                <img src={CalendarIcon} alt={'calendar'} />
                <span>{monthNames[date.getMonth()]}</span>
                <span>{date.getDay() + nth(date.getDay())}</span>
                <span>{date.getFullYear()}</span>
              </div>
            </Tooltip>
            <div className={'divider'} />
            {campaignData.price > 0 && !campaignData.is_free && (
              <div className={'nft-price'}>
                <span className={'eth-icon'}>
                  <EthIcon />
                  {(campaignData.price / currentETHPrice).toFixed(2)}
                </span>
                <span>{`$${campaignData.price}`}</span>
              </div>
            )}
            {!campaignData.price && !campaignData.is_free && (
              <div className={'nft-price'}>
                <p>This NFT doesn't have set price</p>
              </div>
            )}
            {campaignData.is_free === true && (
              <div className={'nft-price'}>
                <p>This NFT is free</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default SingleCampaign;