import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteNFT, addToCampaign, removeFromCampaign } from '../../store/nftSlice';
import { useNavigate } from 'react-router-dom';

import { ApiAxios } from '../../api/Api';
import { useCurrentEthPrice } from '../../hooks/GetEthPrice';
import { ModalContext } from '../../context/ModalContext';
import { CampaignDropdown } from '../micro/FormComponents';
import { getInitialCampaigns } from '../../store/campaignSlice';

import { toast } from 'react-toastify';

import PenIcon from '../../assets/icons/pen.png';
import TrashIcon from '../../assets/icons/trash.png';
import GoLiveIcon from '../../assets/icons/go-live.png';
import RemoveIcon from '../../assets/icons/remove.png';
import NoImage from '../../assets/img/no-image.png';

const TableColumns = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const campaigns = useSelector((state) => state.campaigns.draft);

  const { setContent, handleClose, handleOpen } = useContext(ModalContext);

  const currentETHPrice = useCurrentEthPrice()?.MATIC?.USD;
  const [availableCampaigns, setAvailableCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedNFT, setSelectedNFT] = useState('');
  const [sendToCampaign, setSendToCampaign] = useState(0);

  useEffect(() => {
    dispatch(getInitialCampaigns({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tableActionsClass = (row) => {
    if (
      ((!row.campaign_id || row.campaign_id === '') && row.status === 'draft') ||
      row.status === 'ready' ||
      row.status === 'draft'
    ) {
      return 'has-three-actions';
    }
    return '';
  };

  const handleUpdate = (nft) => {
    navigate(`/dashboard/nfts/update/${nft._id}`);
  };

  // eslint-disable-next-line no-unused-vars
  const handleMint = (nft) => {
    ApiAxios.post('/nfts/mint', nft)
      .then(function (response) {
        toast[response.data.notification.type](response.data.notification.message, {
          autoClose: 10000,
          closeButton: false,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleDelete = (row) => {
    const tempNFTId = row._id;
    handleOpen();
    setContent(
      <>
        <div className={'modal-body-main'}>
          <h2>Are you sure you want to delete {row.name} ?</h2>
        </div>
        <div className={'modal-footer-main'}>
          <button className={'action-button outlined white'} onClick={handleClose}>
            No
          </button>
          <button
            className={'action-button outlined white'}
            onClick={() => {
              dispatch(deleteNFT(tempNFTId));
              handleClose();
            }}
          >
            Yes
          </button>
        </div>
      </>
    );
  };

  const modalContent = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          alignItems: 'center',
        }}
      >
        {availableCampaigns.length > 0 && (
          <div className='add-to-compaign'>
            <h2 style={{marginBottom: '24px'}}>Please choose one of the campaigns.</h2>
            <CampaignDropdown
              options={availableCampaigns}
              labelActive={false}
              label={'Select Campaign'}
              setOption={setSelectedCampaign}
              value={selectedCampaign}
            />
            <button
              disabled={campaigns.length === 0}
              onClick={() => setSendToCampaign((prev) => prev + 1)}
              className="action-button"
              style={{marginTop:'28px'}}
            >
              Validate
            </button>
          </div>
        )}
        {availableCampaigns.length === 0 && (
          <>
            <h2>You don't have any campaigns, please create one.</h2>
            <button
              onClick={() => {
                navigate('/dashboard/campaigns/create');
                handleClose();
              }}
              className="action-button outlined white"
            >
              Go to campaigns
            </button>
          </>
        )}
      </div>
    );
  };

  const handleAddToCampaign = async () => {
    handleOpen();
    setContent(modalContent());
  };

  useEffect(() => {
    if (sendToCampaign > 0 && selectedCampaign !== '') {
      dispatch(
        addToCampaign({
          campaignId: selectedCampaign,
          nftId: selectedNFT,
        })
      );
      setSelectedCampaign('');
      setSelectedNFT('');
      setSendToCampaign(0);
      handleClose();
      dispatch(getInitialCampaigns({}));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendToCampaign, setSelectedNFT, setSelectedCampaign, dispatch]);

  const removeFromCampaignHandler = async (data) => {
    dispatch(removeFromCampaign({ campaignId: data.campaign_id, nftId: data._id }));
    await dispatch(getInitialCampaigns({}));
  };

  useEffect(() => {
    const tempCampaigns = campaigns.filter((item) => item.status === 'draft' && !item.nft_id);
    setAvailableCampaigns(tempCampaigns);
  }, [campaigns]);

  const draftColumns = [
    {
      name: 'Image',
      maxWidth: '100px',
      minWidth: '80px',
      selector: (row) => (
        <div className="table-image-wrapper">
          {row.image ? (
            <img className={'table-image'} src={`/uploads/${row.image}`} alt={row.name} />
          ) : (
            <img className={'table-image'} src={NoImage} alt={row.name} />
          )}
        </div>
      ),
    },
    {
      name: 'NFT Name',
      maxWidth: '190px',
      minWidth: '170px',
      selector: (row) => row.name,
      whiteSpace: 'initial',
    },
    {
      name: 'Campaign Name',
      maxWidth: '190px',
      minWidth: '170px',
      selector: (row) => {
        if (row.campaign) return row.campaign.name;
        else return 'N/A';
      },
    },
    {
      name: 'Status',
      selector: (row) => {
        if (row.status === 'ready') return 'Ready';
        if (row.status === 'adminApproved') return 'Approved';
        if (row.status === 'draft') return 'Draft';
        if (row.status === 'adminRefused') return 'Refused';
        if (row.status === 'live') return 'Live';
        if (row.status === 'ended') return 'Burned';
        if (row.status === 'underReview') return 'Under review';
      },
      maxWidth: '120px',
      minWidth: '80px',
    },
    {
      name: 'Price',
      maxWidth:'180px',
      minWidth: '130px',
      selector: (row) =>
        typeof row.is_free !== 'undefined' && !row.is_free ? (
          <div className="eth-pricing">
            <p>{row.price ? `$ ${row.price.toFixed(2)}` : 'N/A'}</p>
            <p>{row.price ? (row.price / currentETHPrice).toFixed(4) : 'N/A'} MATIC</p>
          </div>
        ) : !row.is_free ? (
          'N/A'
        ) : (
          'Free NFT'
        ),
    },
    {
      name: 'Supply',
      maxWidth: '95px',
      minWidth: '80px',
      selector: (row) => (!row.copies ? 'N/A' : row.copies),
    },
    {
      name: 'Date',
      maxWidth: '120px',
      minWidth: '80px',
      selector: (row) => {
        if (row.created_at) return new Date(row.created_at).toISOString().substring(0, 10);
      },
    },
    {
      name: 'Actions',
      maxWidth: '300px',
      minWidth: '200px',
      selector: (row) => {
        return (
          <div className={`table-actions nft-button ${tableActionsClass(row)}`}>

            {(row?.campaign?.status !== 'live' || row?.status !== 'live') && (
              <button disabled={row.status === 'underReview'} onClick={() => handleUpdate(row)}>
                <img src={PenIcon} alt="edit" />
                <span>Edit</span>
              </button>
            )}
            {(!row.campaign_id || row.campaign_id === '') && (
              <button
                disabled={(row.status === 'draft')}
                onClick={() => {
                  handleAddToCampaign();
                  setSelectedNFT(row._id);
                }}
              >
                <img src={GoLiveIcon} alt="edit" />
                <span>
                  Add to Campaign
                </span>
              </button>
            )}
            
            {row.campaign_id &&
              row.campaign_id !== '' &&
              row?.campaign?.status === 'draft' &&
              (row.status === 'ready' || row.status === 'draft') && (
                <button onClick={() => removeFromCampaignHandler(row)}>
                  <img src={RemoveIcon} alt="remove icon" />
                  <span>
                    Remove from Campaign
                  </span>
                </button>
              )}
            {row?.campaign?.status !== 'live' && row?.status !== 'live' && (
              <button disabled={row.status === 'underReview'} className={row.status === 'underReview' || row.status === 'adminApproved' ? 'centerButton':''} onClick={() => handleDelete(row)}>
                <img src={TrashIcon} alt="edit" />
                <span>Trash</span>
              </button>
            )}
            {/* <button
              disabled={row.status === 'underReview' || row.status === 'live'}
              onClick={() => handleMint(row)}>
              <img src={MintIcon} alt="edit" />
              <span>Mint</span>
            </button> */}
          </div>
        );
      },
    },
  ];

  return draftColumns;
};

export { TableColumns };
