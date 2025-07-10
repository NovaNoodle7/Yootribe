import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import DashContent from '../../../components/micro/DashContent';

import SuperAdminTable from '../../../components/CampaignTable/SuperAdminTable';
import { customStyles } from '../../../context/ModalContext';
import { approveCampaign, getSuperUserCampaigns, refuseCampaign } from '../../../store/campaignSlice';

import Modal from 'react-modal';

export const AdminCampaignsPage = () => {
  const dispatch = useDispatch();
  const campaigns = useSelector((state) => state.campaigns.superUser);
  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [refusalMessage, setRefusalMessage] = useState('');

  React.useEffect(() => {
    dispatch(getSuperUserCampaigns({}));
  });

  return (
    <DashContent>
      <Modal
        isOpen={openApprove}
        onRequestClose={() => {
          setOpenApprove(false);
          setSelectedCampaign(null);
        }}
        style={customStyles}
      >
        <div className={'modal-body-main'}>
          <h2>Are you sure you want to approve {selectedCampaign?.name} ?</h2>
        </div>
        <div className={'modal-footer-main'}>
          <button
            className={'action-button outlined white'}
            onClick={() => {
              setOpenApprove(false);
              setSelectedCampaign(null);
            }}
          >
            No
          </button>
          <button
            className={'action-button outlined white'}
            onClick={() => {
              dispatch(approveCampaign({ campaign: selectedCampaign }));
              setOpenApprove(false);
              setSelectedCampaign(null);
            }}
          >
            Yes
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={openReject}
        onRequestClose={() => {
          setOpenReject(false);
          setSelectedCampaign(null);
        }}
        style={customStyles}
      >
        <div className={'modal-body-main'}>
          <h2>Are you sure you want to reject {selectedCampaign?.name} ?</h2>
          <div style={{ marginTop: '10px' }} className="input-wrapper">
            <label>
              <input
                onChange={(e) => setRefusalMessage(e.target.value)}
                type={'text'}
                placeholder={'Please enter refusal message'}
                style={{ width: '100%' }}
              />
            </label>
          </div>
        </div>
        <div className={'modal-footer-main'}>
          <button
            className={'action-button outlined white'}
            onClick={() => {
              setOpenReject(false);
              setSelectedCampaign(null);
            }}
          >
            No
          </button>
          <button
            className={'action-button outlined white'}
            disabled={refusalMessage === ''}
            onClick={() => {
              dispatch(refuseCampaign({ campaign: selectedCampaign, refusalMessage }));
              setOpenReject(false);
              setSelectedCampaign(null);
            }}
          >
            Yes
          </button>
        </div>
      </Modal>
      <div className={'nft-content'}>
        <div className="container">
          <div className={'create-listed'}>{`${campaigns?.length} campaigns submitted for review`}</div>
          <div className="table-responsive">
            {campaigns.length > 0 ? (
              <SuperAdminTable
                setOpenApprove={setOpenApprove}
                setOpenReject={setOpenReject}
                setSelectedCampaign={setSelectedCampaign}
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
