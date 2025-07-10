import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { useCurrentEthPrice } from '../../hooks/GetEthPrice';
import { customStyles } from '../../context/ModalContext';
import { NavLink, useNavigate } from 'react-router-dom';

import NoImage from '../../assets/img/no-image.png';

export const tableStyles = {
  headRow: {
    style: {
      fontSize: 15,
      color: '#05506d',
      fontWeight: 'bold',
      borderBottom: 'none',
    },
  },
  headCells: {
    style: {
      borderLeft: '1px solid #2b2b2b',

      '&:first-of-type': {
        borderLeft: 'none',
      },
    },
  },
  rows: {
    style: {
      borderTop: '1px solid #2b2b2b',
    },
  },
  cells: {
    style: {
      fontSize: 15,
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'normal',
      color: '#2b2b2b',
      borderLeft: '1px solid #2b2b2b',
      borderRight: 'none',

      '& > div:first-child': {
        whiteSpace: 'unset!important',
      },

      '& button': {
        backgroundColor: 'transparent',
        border: 'none',
      },

      '&:first-of-type': {
        paddingTop: '10px',
        paddingBottom: '10px',
        borderLeft: 'none',
        div: {
          width: '100%',
        },
      },
      '&:last-of-type': {
        borderRight: 'none',
        div: {
          width: '100%',
        },
      },
    },
  },
};

const SuperAdminTable = ({ setOpenApprove, setOpenReject, setSelectedCampaign }) => {
  const allCampaigns = useSelector((state) => state.campaigns.superUser);
  const allNfts = useSelector((state) => state.nft.nfts);
  const [viewCampaignData, setViewCampaignData] = useState({});
  const [showCampaign, setShowCampaign] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [showImage, setShowImage] = useState(false);
  const [viewNFTData, setViewNFTData] = useState({});

  const currentETHPrice = useCurrentEthPrice()?.MATIC?.USD;

  useEffect(() => {
    if (viewCampaignData && viewCampaignData?.nft_id && allNfts.length > 0) {
      const tempNFT = allNfts.find((item) => item._id === viewCampaignData.nft_id);
      setViewNFTData(tempNFT);
    }
  }, [showCampaign, allNfts]);

  const SuperAdminColumns = [
    {
      name: 'Date',
      selector: (row) => moment(row.created_at).format('DD/MM/YY'),
    },
    {
      name: 'Campaign Name',
      minWidth: '200px',
      selector: (row) => 
      (
        <div>
          {row?.name ? (
            <a href={`/auth/register/campaign/${row.slug}`} style={{display:'block'}} target='_blank'>{row.name}</a>
          ) : (
            'N/A'
          )}
        </div>
      ),
    },
    {
      name: 'End date',
      selector: (row) => moment(row.ends_at).format('DD/MM/YY'),
    },
    {
      name: 'Keywords',
      selector: (row) => (
        <div>
          {row.keywords&&row.keywords.length > 0 ? (
            row.keywords.map((objet) =>
              <p>- {objet.word}</p>
            )
          )
          :'N/A'
          }
        </div>
      ),
    },
    {
      name: 'Owner',
      selector: (row) => 
      (
        <div>
          {row?.name ? (
            <NavLink to={`/admin/brands`}>{row?.user?.company|| row?.user?.first_name + ' ' + row?.user?.last_name}</NavLink>
          ) : (
            'N/A'
          )}
        </div>
      ),
    },
    {
      name: 'NFT Name',
      selector: (row) => row?.nft?.name || 'N/A',
    },
    {
      name: 'NFT Description',
      selector: (row) => row?.nft?.description || 'N/A',
    },
    {
      name: 'NFT Image',
      selector: (row) => (
        <div className="table-image-wrapper">
          {row?.nft?.image ? (
            <img
              className={'table-image'}
              src={`${process.env.REACT_APP_API}/uploads/${row?.nft?.image}`}
              alt={row?.nft?.name}
              style={{cursor:'pointer'}}
              onClick={() => {
                setShowImage(true)
                setImgSrc(`${process.env.REACT_APP_API}/uploads/${row?.nft?.image}`)
              }}
            />
          ) : (
            <img className={'table-image'} src={NoImage} alt={row?.nft?.name} />
          )}
        </div>
      ),
    },
    {
      name: 'Price',
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
      selector: (row) => row?.nft?.copies || 'N/A',
    },
    {
      name: 'Leads',
      selector: (row) => row?.nft?.leads?.length || 'N/A',
    },
    {
      name: 'Actions',
      minWidth: '250px',
      selector: (row) => (
        <div className={'table-actions'}>
          <button
            onClick={() => {
              setSelectedCampaign(row);
              setOpenApprove(true);
            }}
          >
            Approve
          </button>
          <button
            onClick={() => {
              setSelectedCampaign(row);
              setOpenReject(true);
            }}
          >
            Reject
          </button>
          <button
            onClick={() => {
              setViewCampaignData(row);
              setShowCampaign(true);
            }}
          >
            View <br />
            Campaign
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="main-table-wrapper">
      <Modal
        isOpen={showImage}
        onRequestClose={() => {
          setShowImage(false);
        }}
        style={customStyles}
      >
        <img src={imgSrc} style={{width:'100%'}}/>
      </Modal>
      <Modal
        isOpen={showCampaign}
        onRequestClose={() => {
          setShowCampaign(false);
          setViewCampaignData({});
        }}
        style={customStyles}
      >
        <div className={'modal-body-main'}>
          <div className={'single-info'}>
            <p>Campaign Logo:</p>
            <img src={`${process.env.REACT_APP_API}/uploads/${viewCampaignData.logo}`} alt={'logo'} />
          </div>
          <div className={'single-info'}>
            <p>Campaign Banner:</p>
            <img src={`${process.env.REACT_APP_API}/uploads/${viewCampaignData.cover}`} alt={'cover'} />
          </div>
          <div className={'single-info'}>
            <p>Campaign name:</p>
            <p>{viewCampaignData.name}</p>
          </div>
          <div className={'single-info'}>
            <p>Campaign title:</p>
            <p>{viewCampaignData.title}</p>
          </div>
          <div className={'single-info'}>
            <p>Campaign slug:</p>
            <p>{viewCampaignData.slug}</p>
          </div>
          <div className={'single-info'}>
            <p>Campaign keywords:</p>
            <div className="tags">
              {viewCampaignData?.keywords?.length > 0 && viewCampaignData.keywords.map((item) => <p style={{fontWeight:300,textAlign:'left'}}>-{item.word}</p>)}
            </div>
          </div>
          <div className={'single-info'}>
            <p>Campaign ends at:</p>
            <p>{viewCampaignData?.ends_at && new Date(viewCampaignData.ends_at).toUTCString()}</p>
          </div>
          <div className={'single-info'}>
            <p>Campaign fields:</p>
            <div className={'modal-fields'}>
              <ul>
                <li>
                  <span> Placeholder </span>
                  <span> Required </span>
                  <span> Type </span>
                </li>
                {viewCampaignData?.fields?.length > 0 &&
                  viewCampaignData.fields.map((item) => (
                    <li>
                      <span>{item.placeholder}</span>
                      <span>{item.required?'*':''}</span>
                      <span>{item.type}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div className={'single-info'}>
            <p>NFT Name:</p>
            <p>{viewNFTData?.name}</p>
          </div>
          <div className={'single-info'}>
            <p>NFT Image:</p>
            <img src={`${process.env.REACT_APP_API}/uploads/${viewNFTData?.image}`} alt={'logo'} />
          </div>
          <div className={'single-info'}>
            <p>NFT Description:</p>
            <p>{viewNFTData?.description}</p>
          </div>
          <div className={'single-info'}>
            <p>NFT Price:</p>
            {viewNFTData && !viewNFTData?.is_free && (
              <p>
                {`$ ${viewNFTData?.price}`}
                <p>{(viewNFTData?.price / currentETHPrice).toFixed(4)} MATIC</p>
              </p>
            )}
            {viewNFTData && viewNFTData?.is_free && <p>This NFT is free</p>}
          </div>
          <div className={'single-info'}>
            <p>NFT Copies to sell:</p>
            <p>{viewNFTData?.copies}</p>
          </div>
          <div className={'modal-footer-main'}>
            <button
              className={'action-button outlined white'}
              onClick={() => {
                setShowCampaign(false);
                setViewCampaignData({});
              }}
            >
              Ok
            </button>
          </div>
        </div>
      </Modal>
      <DataTable
        responsive
        columns={SuperAdminColumns}
        data={allCampaigns}
        customStyles={tableStyles}
        pagination
        paginationRowsPerPageOptions={[5, 10]}
        paginationPerPage={10}
      />
    </div>
  );
};

export default SuperAdminTable;
