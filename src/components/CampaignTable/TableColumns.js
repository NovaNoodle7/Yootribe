import React, {useContext, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { deleteCampaign, getInitialCampaigns, updateCampaign } from '../../store/campaignSlice';
import { useNavigate } from 'react-router-dom';
import { useCurrentEthPrice } from '../../hooks/GetEthPrice';

import { ModalContext } from '../../context/ModalContext';
import { getDaysToEnd } from '../../helpers/functions';

import { InfoIcon } from '../../assets/icons';
import PenIcon from '../../assets/icons/pen.png';
import TrashIcon from '../../assets/icons/trash.png';
import GoLiveIcon from '../../assets/icons/go-live.png';
import PreviewIcon from '../../assets/icons/eye.png';
import PauseIcon from '../../assets/img/puase.png';
import NoImage from '../../assets/img/no-image.png';
import {CSVLink} from "react-csv";
import {getCampaignLeads} from "../../api";

const CampaignTableColumns = ({ setCurrentTab, currentTab }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { setContent, handleClose, handleOpen } = useContext(ModalContext);
  const user = useSelector((state) => state.auth?.value?.user);

  const currentETHPrice = useCurrentEthPrice()?.MATIC?.USD;

  const handleUpdate = (nft) => {
    navigate(`/dashboard/campaigns/edit/${nft._id}`, {
      state: {
        currentTab,
      },
    });
  };

  const handleDelete = (row, type) => {
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
              dispatch(deleteCampaign({ campaign: row, type }));
              handleClose();
            }}
          >
            Yes
          </button>
        </div>
      </>
    );
  };

  const handleCampaignSubmit = (campaign) => {
    handleOpen();
    dispatch(updateCampaign({ campaign, type: 'adminApproval' }));
    setContent(
     <>
        <div className='create-create-compagn-modal'>
          <p>We appreciate your submission.<br/>
              Our team will review your campaign and will quickly notify you by email once it has been approved.</p>
        </div>

     </>
    );
    dispatch(getInitialCampaigns({}));
  };

  const csvLinkEl = React.createRef();
  const [csvFileName, setCsvFileName] = useState('file');
  const [csvFileHeader, setCsvFileHeader] = React.useState([]);
  const [csvFileData, setCsvFileData] = useState([]);
  const handleDownload = async function (campaign) {
    setCsvFileName(campaign.name.replaceAll(/\W/g, '_') + '.csv');

    const csvLinkElCurrent = csvLinkEl.current;
    getCampaignLeads(campaign._id)
      .then((res) => {
        setCsvFileHeader(res.questions);
        setCsvFileData(res.leads);

        setTimeout(() => {
          csvLinkElCurrent.link.click();
        });
      })
      .catch((err) => {
        console.log(err)
      })
  };

  const handlePreview = (campaign) => {
    window.open(`${window.location.origin}/auth/register/campaign/${campaign.slug}`, '_blank');
  };

  const handleLiveCampaign = (campaign) => {
    handleOpen();
    dispatch(updateCampaign({ campaign, type: 'live' }));
    setContent(<h2>Your campaign is live! !</h2>);
    dispatch(getInitialCampaigns({}));
  };

  const readRefusedMessage = (campaign) => {
    handleOpen();
    setContent(
      <>
        <div className={'modal-body-main'}>
          <h2>{campaign.refusalMessage}</h2>
        </div>
        <div className={'modal-footer-main'}>
          <button
            className={'action-button outlined white'}
            onClick={() => {
              dispatch(
                updateCampaign({
                  campaign: {
                    ...campaign,
                    status: 'draft',
                    refusalMessage: '',
                  },
                  type: 'draft',
                })
              );
              handleClose();
            }}
          >
            Ok
          </button>
        </div>
      </>
    );
    dispatch(getInitialCampaigns({}));
  };

  const handleCancel = (row) => {
    handleOpen();
    setContent(
      <>
        <div className={'modal-body-main'}>
          <h2>Are you sure you want to stop campaign {row.name} ?</h2>
        </div>
        <div className={'modal-footer-main'}>
          <button className={'action-button outlined white'} onClick={handleClose}>
            No
          </button>
          <button
            className={'action-button outlined white'}
            onClick={() => {
              dispatch(updateCampaign({ campaign: row, type: 'cancel' }));
              handleClose();
            }}
          >
            Yes
          </button>
        </div>
      </>
    );
  };

  const draftColumns = [
    {
      name: 'Logo',
      maxWidth: '100px',
      minWidth: '80px',
      selector: (row) => (
        <div className="table-image-wrapper">
          {row.logo ? (
            <img className={'table-image'} src={`${process.env.REACT_APP_API}/uploads/${row.logo}`} alt={row.name} />
          ) : (
            <img className={'table-image'} src={NoImage} alt={row.name} />
          )}
        </div>
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.status === 'adminApproved',
          style: {
            backgroundColor: '#034e6e08',
          },
        },
      ],
    },
    {
      name: 'Campaign Name',
      maxWidth: '200px',
      minWidth: '180px',
      selector: (row) => row.name,
      conditionalCellStyles: [
        {
          when: (row) => row.status === 'adminApproved',
          style: {
            backgroundColor: '#034e6e08',
          },
        },
      ],
    },
    {
      name: 'Status',
      maxWidth: '120px',
      minWidth: '80px',
      selector: (row) => {
        if (row.status === 'draft' && row.canceled_at) return 'Canceled';
        if (row.status === 'adminApproval') return 'Under review';
        if (row.status === 'adminApproved') return 'Approved';
        if (row.status === 'draft') return 'Draft';
        if (row.status === 'adminRefused')
          return (
            <div className={'status-button'}>
              Refused
              <button onClick={() => readRefusedMessage(row)}>
                <InfoIcon />
              </button>
            </div>
          );
      },
      conditionalCellStyles: [
        {
          when: (row) => row.status === 'adminApproved',
          style: {
            backgroundColor: '#034e6e08',
          },
        },
      ],
    },
    {
      name: 'Ends in',
      maxWidth: '150px',
      minWidth: '120px',
      selector: (row) => {
        if (row.ends_at) {
          const date = new Date(row.ends_at).toISOString().slice(0, 10);
          return <p>{date}</p>;
        } else {
          return <p>N/A</p>;
        }
      },
      conditionalCellStyles: [
        {
          when: (row) => row.status === 'adminApproved',
          style: {
            backgroundColor: '#034e6e08',
          },
        },
      ],
    },
    {
      name: 'NFT Name',
      maxWidth: '200px',
      minWidth: '180px',
      selector: (row) => {
        return row?.nft?.name || 'N/A';
      },
      conditionalCellStyles: [
        {
          when: (row) => row.status === 'adminApproved',
          style: {
            backgroundColor: '#034e6e08',
          },
        },
      ],
    },
    {
      name: 'Price',
      maxWidth: '150px',
      minWidth: '100px',
      selector: (row) => {
        const tiedNFT = row?.nft;

        if (tiedNFT && !tiedNFT.is_free) {
          return (
            <div className="eth-pricing">
              <p>{`${tiedNFT.price ? `$ ${tiedNFT.price.toFixed(2)}` : 'N/A'}`}</p>
              <p>{tiedNFT.price ? `${(tiedNFT.price / currentETHPrice).toFixed(4)} MATIC` : ''} </p>
            </div>
          );
        }

        if (tiedNFT && tiedNFT.is_free) {
          return 'Free NFT';
        } else {
          return 'N/A';
        }
      },
      conditionalCellStyles: [
        {
          when: (row) => row.status === 'adminApproved',
          style: {
            backgroundColor: '#034e6e08',
          },
        },
      ],
    },
    {
      name: 'Supply',
      maxWidth: '90px',
      minWidth: '70px',
      selector: (row) => {
        const tiedNFT = row?.nft;

        if (tiedNFT) {
          return tiedNFT.copies;
        } else {
          return 'N/A';
        }
      },
      conditionalCellStyles: [
        {
          when: (row) => row.status === 'adminApproved',
          style: {
            backgroundColor: '#034e6e08',
          },
        },
      ],
    },
    {
      name: 'Actions',
      maxWidth: '280px',
      minWidth: '200px',
      selector: (row) => (
        <div className={'table-actions button-compaign'}>
          {(row.status === 'draft' || row.status === 'ready') ? (
            <>
              {!row.canceled_at && (
                <button onClick={() => handleUpdate(row)}>
                  <img src={PenIcon} alt="edit" />
                  <span>Edit</span>
                </button>
              )}
              <button className='preview' onClick={() => handlePreview(row)}>
                <img src={PreviewIcon} alt="Preview" />
                <span>Preview</span>
              </button>
              <button
                disabled={row.copies === null}
                onClick={() => {
                  handleDelete(row, 'draft');
                }}
              >
                <img src={TrashIcon} alt="delete" />
                <span>Trash</span>
              </button>

              {/*{!row.canceled_at && (
                <button
                  disabled={
                    (!user.kyb_passed && !user.is_superadmin) ||
                    !user.is_superadmin ||
                    !row.slug ||
                    !row.name ||
                    !row.title ||
                    row?.keyword_ids?.length === 0 ||
                    !row.content ||
                    !row.logo ||
                    !row.cover ||
                    !row.nft_id
                  }
                  onClick={() => {
                    if (row.status === 'draft') {
                      handleCampaignSubmit(row);

                      return;
                    }

                    handleLiveCampaign(row);
                  }}
                >
                  <img src={GoLiveIcon} alt="go live" />
                  <span>Submit</span>
                </button>
              )}*/}
            </>
          ) :''}
          {row.status === 'adminApproval'?
            <div className='d-flex justify-content-center'>
              <button onClick={() => handlePreview(row)}>
                <img src={PreviewIcon} alt="Preview" />
                <span>Preview</span>
              </button>
            </div>:''}
          {row.status === 'adminApproved' && (
            <>
              <button onClick={() => handleUpdate(row)}>
                <img src={PenIcon} alt="edit" />
                <span>Edit</span>
              </button>
              <button className='preview' onClick={() => handlePreview(row)}>
                  <img src={PreviewIcon} alt="Preview" />
                  <span>Preview</span>
                </button>
              <button className='golive' onClick={() => handleLiveCampaign(row)}>
                <img src={GoLiveIcon} alt="go live" />
                <span>Go live</span>
              </button>
              <button
                disabled={row.copies === null}
                onClick={() => {
                  handleDelete(row, 'adminApproved');
                }}
              >
                <img src={TrashIcon} alt="delete" />
                <span>Trash</span>
              </button>
            </>
          )}
        </div>
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.status === 'adminApproved',
          style: {
            backgroundColor: '#034e6e08',
          },
        },
      ],
    },
  ];

  const whitelistedColumns = [
    {
      name: 'Logo',
      maxWidth: '100px',
      minWidth: '80px',
      selector: (row) => (
        <div className="table-image-wrapper">
          {row.logo ? (
            <img className={'table-image'} src={`${process.env.REACT_APP_API}/uploads/${row.logo}`} alt={row.name} />
          ) : (
            <img className={'table-image'} src={NoImage} alt={row.name} />
          )}
        </div>
      ),
      conditionalCellStyles: [
        {
          when: (row) => row.status === 'adminApproved',
          style: {
            backgroundColor: '#034e6e08',
          },
        },
      ],
    },
    {
      name: 'Campaign Name',
      maxWidth: '250px',
      minWidth: '190px',
      selector: (row) => row.name,
      conditionalCellStyles: [
        {
          when: (row) => row.status === 'adminApproved',
          style: {
            backgroundColor: '#034e6e08',
          },
        },
      ],
    },
    {
      name: 'Status',
      maxWidth: '120px',
      minWidth: '80px',
      selector: (row) => {
        return 'Ended';
      },
      conditionalCellStyles: [
        {
          when: (row) => row.status === 'adminApproved',
          style: {
            backgroundColor: '#034e6e08',
          },
        },
      ],
    },
    {
      name: 'Ends in',
      maxWidth: '150px',
      minWidth: '120px',
      selector: (row) => {
        if (row.ends_at) {
          const date = new Date(row.ends_at).toISOString().slice(0, 10);
          return <p>{date}</p>;
        } else {
          return <p>N/A</p>;
        }
      },
      conditionalCellStyles: [
        {
          when: (row) => row.status === 'adminApproved',
          style: {
            backgroundColor: '#034e6e08',
          },
        },
      ],
    },
    {
      name: 'NFT Name',
      maxWidth: '250px',
      minWidth: '190px',
      selector: (row) => {
        return row?.nft?.name || 'N/A';
      },
      conditionalCellStyles: [
        {
          when: (row) => row.status === 'adminApproved',
          style: {
            backgroundColor: '#034e6e08',
          },
        },
      ],
    },
    {
      name: 'Price',
      maxWidth: '170px',
      minWidth: '130px',
      selector: (row) => {
        const tiedNFT = row?.nft;

        if (tiedNFT && !tiedNFT.is_free) {
          return (
            <div className="eth-pricing">
              <p>{`${tiedNFT.price ? `$ ${tiedNFT.price.toFixed(2)}` : 'N/A'}`}</p>
              <p>{tiedNFT.price ? `${(tiedNFT.price / currentETHPrice).toFixed(4)} MATIC` : ''} </p>
            </div>
          );
        }

        if (tiedNFT && tiedNFT.is_free) {
          return 'Free NFT';
        } else {
          return 'N/A';
        }
      },
      conditionalCellStyles: [
        {
          when: (row) => row.status === 'adminApproved',
          style: {
            backgroundColor: '#034e6e08',
          },
        },
      ],
    },
    {
      name: 'Supply',
      maxWidth: '130px',
      minWidth: '90px',
      selector: (row) => {
        const tiedNFT = row?.nft;

        if (tiedNFT) {
          return tiedNFT.copies;
        } else {
          return 'N/A';
        }
      },
      conditionalCellStyles: [
        {
          when: (row) => row.status === 'adminApproved',
          style: {
            backgroundColor: '#034e6e08',
          },
        },
      ],
    },
    {
      name: 'Leads',
      maxWidth: '100px',
      minWidth: '70px',
      selector: (row) => {
        if (row?.leads) {
          return row?.leads?.length;
        } else {
          return 0;
        }
      },
    },
    {
      name: 'claimed NFT',
      selector: (row) => {
        const tiedNFT = row?.nft;

        if (tiedNFT) {
          return tiedNFT.mintedCount;
        } else {
          return 'N/A';
        }
      },
      conditionalCellStyles: [
        {
          when: (row) => row.status === 'adminApproved',
          style: {
            backgroundColor: '#034e6e08',
          },
        },
      ],
    },
    {
      name: 'Total',
      selector: (row) => {
        const tiedNFT = row?.nft;

        if (tiedNFT && !tiedNFT.is_free) {
          const price = tiedNFT.price * (tiedNFT.mintedCount ?? 0)
          return (
              <div className="eth-pricing">
                <p>{`${price ? `$ ${price.toFixed(2)}` : 'N/A'}`}</p>
                <p>{price ? `${(price / currentETHPrice).toFixed(4)} MATIC` : ''} </p>
              </div>
          );
        } else {
          return 'N/A';
        }
      },
      conditionalCellStyles: [
        {
          when: (row) => row.status === 'adminApproved',
          style: {
            backgroundColor: '#034e6e08',
          },
        },
      ],
    },
    {
      name: 'Actions',
      maxWidth: '260px',
      minWidth: '100px',
      selector: (row) => (
        <div className={'table-actions button-compaign'}>
          <button onClick={() => handleDownload(row)}>
            <img src={GoLiveIcon} alt="Download" />
            <span>
              Download
              <br />
              leads
            </span>
          </button>
          <CSVLink
            headers={csvFileHeader}
            filename={csvFileName}
            data={csvFileData}
            ref={csvLinkEl}
          />
        </div>
      ),
    },
  ];

  const liveColumns = [
    {
      name: 'Logo',
      maxWidth: '100px',
      minWidth: '80px',
      selector: (row) => (
        <div className="table-image-wrapper">
          {row.logo ? (
            <img className={'table-image'} src={`${process.env.REACT_APP_API}/uploads/${row.logo}`} alt={row.name} />
          ) : (
            <img className={'table-image'} src={NoImage} alt={row.name} />
          )}
        </div>
      ),
    },
    {
      name: 'Campaign Name',
      maxWidth: '200px',
      minWidth: '180px',
      selector: (row) => row.name,
    },
    {
      name: 'NFT Name',
      maxWidth: '200px',
      minWidth: '180px',
      selector: (row) => {
        return row?.nft?.name || 'N/A';
      },
    },
    {
      name: 'Days',
      maxWidth: '120px',
      minWidth: '80px',
      selector: (row) => {
        const days = getDaysToEnd(row.started_at, row.ends_at);

        if (days) {
          return `${days.CurrentTotalDays}/${days.TotalDays}`;
        } else {
          return 'N/A';
        }
      },
    },
    {
      name: 'Price',
      maxWidth: '120px',
      minWidth: '80px',
      selector: (row) => {
        const tiedNFT = row?.nft;

        if (tiedNFT && !tiedNFT.is_free) {
          return (
            <div className="eth-pricing">
              <p>{`${tiedNFT.price ? `$ ${tiedNFT.price.toFixed(2)}` : 'N/A'}`}</p>
              <p>{tiedNFT.price ? `${(tiedNFT.price / currentETHPrice).toFixed(4)} MATIC` : ''} </p>
            </div>
          );
        }

        if (tiedNFT && tiedNFT.is_free) {
          return 'Free NFT';
        } else {
          return 'N/A';
        }
      },
    },
    {
      name: 'Supply',
      maxWidth: '120px',
      minWidth: '80px',
      selector: (row) => {
        const tiedNFT = row?.nft;
        if (tiedNFT) {
          return tiedNFT.copies;
        } else {
          return 'N/A';
        }
      },
    },
    {
      name: 'Leads',
      maxWidth: '120px',
      minWidth: '80px',
      selector: (row) => {
        if (row?.leads) {
          return row?.leads?.length;
        } else {
          return 0;
        }
      },
    },
    {
      name: 'Date',
      maxWidth: '120px',
      minWidth: '80px',
      selector: (row) => new Date(row.created_at).toISOString().substring(0, 10),
    },
    {
      name: 'Actions',
      maxWidth: '250px',
      minWidth: '80px',
      selector: (row) => (
        <div className={'table-actions live-view-compaign'}>
          <button className='preview' onClick={() => handlePreview(row)}>
            <img src={PreviewIcon} alt="Preview" />
            <span>
              View
              <br />
              Campaign
            </span>
          </button>
          <button onClick={() => handleCancel(row)}>
            <img src={PauseIcon} alt="edit" />
            <span>
              Stop the
              <br />
              Campaign
            </span>
          </button>
        </div>
      ),
    },
  ];

  return {
    draftColumns,
    whitelistedColumns,
    liveColumns,
  };
};

export { CampaignTableColumns };
