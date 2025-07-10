import moment from 'moment';
import React from 'react';
import { useDispatch } from 'react-redux';

import { useCurrentEthPrice } from '../../../../hooks/GetEthPrice';
import { refuseCampaign } from '../../../../store/campaignSlice';
import { ToastContext } from '../../../../context/ToastContext';
import DashContent from '../../../../components/micro/DashContent';
import { NavLink} from 'react-router-dom';
import BackIcon from '../../../../assets/icons/back-icon.png';

export const ReportView = ({ data, closeView }) => {
  const dispatch = useDispatch();
  const { handleToast } = React.useContext(ToastContext);
  const currentETHPrice = useCurrentEthPrice()?.MATIC?.USD;

  const handleEndCampaign = () => {
    dispatch(refuseCampaign({ campaign: data?.campaign, refusalMessage: 'Your campaign is reported as scam' }));
    handleToast(`Campaign "${data?.campaign?.name}" is refused for scam`, 'success');
  };

  return (
    <DashContent>
      <div className={'nft-content'}>
        <div className="container">
          <h4 onClick={closeView} className="mb-5" style={{ color: '#38d8ec', cursor: 'pointer' }}>
            <img src={BackIcon} alt="back icon" className="me-2" />
            Fraud Reports
          </h4>

          <div className="row">
            <div className="col-md-8 row">
              <div className="col-md-6">
                <p>ID : {data?.campaign?._id}</p>
                <p>
                  Campaign Name :{' '}
                  <a href={`/auth/register/campaign/${data?.campaign?.slug}`} target="_blank" rel="noreferrer">
                    {data?.campaign?.name}
                  </a>
                </p>
                <p>Campaign Title : {data?.campaign?.title}</p>
                <p>Campaign Slug : {data?.campaign?.slug}</p>
                <p>Campaign URL : {data?.campaign?.website}</p>
                <p>Campaign Status : {data?.campaign?.status}</p>
                <p>
                  Campaign Company :{' '}
                  <NavLink to={`/admin/brands`}>{data?.campaign?.user?.company}</NavLink>
                </p>
              </div>
              <div className="col-md-6">
                <p>Creation date : {moment(data?.campaign?.created_at).format('DD/MM/YY')}</p>
                <p>End date : {moment(data?.campaign?.ends_at).format('DD/MM/YY')}</p>
                <p>NFT Name: {data?.campaign?.nft?.name}</p>
                <p>NFT Supply: {data?.campaign?.nft?.copies}</p>
                <p>
                  NFT Price: $ {data?.campaign?.nft?.price} /{' '}
                  {(data?.campaign?.nft?.price / currentETHPrice).toFixed(4)} MATIC
                </p>
                <p>NFT Minted: {data?.campaign?.nft?.mintedCount}</p>
                <p>Leads: {data?.campaign?.leads?.length || 0}</p>
              </div>
            </div>
            <div className="col-md-4" style={{ borderLeft: '1px solid #000 ' }}>
              <div className="row">
                <div className="col-md-4">
                  <img
                    className={'table-image'}
                    src={`${process.env.REACT_APP_API}/uploads/${data?.campaign?.logo}`}
                    alt={data.campaign?.name}
                    width="100%"
                    height="auto"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="col-md-8 p-0">
                  <img
                    className={'table-image'}
                    src={`${process.env.REACT_APP_API}/uploads/${data?.campaign?.cover}`}
                    alt={data.campaign?.name}
                    width="100%"
                    height="68px"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </div>

              <div className="mt-5">
                <p>Keywords</p>

                <div>{data?.campaign?.keywords.map((keyword) => <p>-{keyword.word}</p>)}</div>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-3">
              <strong>Campaign Description</strong>
            </p>

            <div dangerouslySetInnerHTML={{ __html: data?.campaign?.content }} />
          </div>

          <button
            className="action-button mt-4 mx-auto"
            onClick={handleEndCampaign}
            disabled={data?.campaign?.status !== 'live'}
          >
            End Campaign
          </button>
        </div>
      </div>
    </DashContent>
  );
};
