import moment from 'moment';
import React, {useContext} from 'react';
import DataTable from 'react-data-table-component';

import DashContent from '../../../../components/micro/DashContent';
import { useCurrentEthPrice } from '../../../../hooks/GetEthPrice';
import { tableStyles } from '../../Reports/components/FraudTab';

import BackIcon from '../../../../assets/icons/back-icon.png';
import {ModalContext} from "../../../../context/ModalContext";
import {kybApproval} from "../../../../api";

export const BrandView = ({ data, closeView }) => {
  const currentETHPrice = useCurrentEthPrice()?.MATIC?.USD;
  const user = data?.user;

  const { setContent, handleOpen, handleClose } = useContext(ModalContext);

  const handleAccept = () => {
    kybApproval(data?._id, {state: 'accepted'})
      .then((res) => {
        data = res.kyb;

        closeView();
      })
  };

  const handleBlock = () => {
    kybApproval(data?._id, {state: 'blocked'})
      .then((res) => {
        data = res.kyb;

        closeView();
      })
  };

  const showPopup = () => {
    setContent(
      <form onSubmit={handleReject} className="form" style={{ width: '100%', padding: '50px 80px' }}>
        <div className="form-group">
          <label style={{color: 'white'}} htmlFor="message">Please describe the errors to help the user fixing it</label>
          <textarea
            id="message"
            name="message"
            required
            style={{ width: '100%' }}
          />
        </div>

        <button className={'action-button outlined white'} type="submit" style={{ width: '100%' }}>
          Send message
        </button>
      </form>
    );

    handleOpen();
  }

  const handleReject = (e) => {
    e.preventDefault();

    kybApproval(data?._id, {state: 'rejected', message: e.target[0].value})
      .then((res) => {
        data = res.kyb;

        closeView();
      })

    handleClose();
  }

  return (
    <DashContent>
      <div className={'nft-content'}>
        <div className="container">
          <h4 onClick={closeView} className="mb-5" style={{ color: '#38d8ec', cursor: 'pointer' }}>
            <img src={BackIcon} alt="back icon" className="me-2" />
            Brands
          </h4>

          <div className="row">
            <div className="col-md-6">
              <p>ID : {user?._id}</p>
              <p>First Name : {user?.first_name}</p>
              <p>Last Name : {user?.last_name}</p>
              <p>Email : {user?.email}</p>
              <p>Phone Number : {user?.phone}</p>
            </div>
            <div className="col-md-6" style={{ borderLeft: '1px solid #000', textAlign: 'right' }}>
              <p>Company Name : {user?.company}</p>
              <p>Location : {user?.company_location}</p>
              <p>
                Website :{' '}
                <a href={`https://${user?.company_website}`} target="_blank" rel="noreferrer">
                  {user?.company_website}
                </a>
              </p>
            </div>
          </div>

          {/* <div className="mt-5">
            <p className="mb-3">
              <strong>Campaign Description</strong>
            </p>

            <div dangerouslySetInnerHTML={{ __html: data?.campaign?.content }} />
          </div> */}

          <div className="mt-5">
            <p className="mb-3">
              <strong>Campaigns</strong>
            </p>

            <DataTable
              columns={[
                {
                  name: 'Date',
                  selector: (row) => moment(row?.campaign?.created_at).format('DD/MM/YY'),
                },
                {
                  name: 'Status',
                  selector: (row) => row?.status?.toUpperCase() || 'N/A',
                },
                {
                  name: 'Name',
                  selector: (row) => row?.name || 'N/A',
                },
                {
                  name: 'Keywords',
                  selector: (row) => row?.keywords?.join(', ') || 'N/A',
                },
                {
                  name: 'NFT Name',
                  selector: (row) => row?.nft?.name || 'N/A',
                },
                {
                  name: 'Price',
                  selector: (row) => {
                    if (row?.nft && !row?.nft.is_free) {
                      return (
                        <div className="eth-pricing">
                          <p>{`${row?.nft.price ? `$ ${row?.nft.price.toFixed(2)}` : 'N/A'}`}</p>
                          <p>{row?.nft.price ? `${(row?.nft.price / currentETHPrice).toFixed(4)} MATIC` : ''} </p>
                        </div>
                      );
                    }

                    if (row?.nft && row?.nft.is_free) {
                      return 'Free NFT';
                    } else {
                      return 'N/A';
                    }
                  },
                },
                {
                  name: 'Leads',
                  selector: (row) => row?.leads?.length || 'N/A',
                },
                {
                  name: 'Minted',
                  selector: (row) => row?.nft?.mintedCount || 'N/A',
                },
              ]}
              data={user?.campaigns.sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at))}
              customStyles={tableStyles}
              pagination
              paginationRowsPerPageOptions={[10, 25, 50, 100]}
              paginationPerPage={10}
            />
          </div>

          <div className="mt-5">
            <p className="mb-3">
              <strong>NFTs</strong>
            </p>

            <DataTable
              columns={[
                {
                  name: 'Date',
                  selector: (row) => moment(row?.created_at).format('DD/MM/YY'),
                },
                {
                  name: 'Status',
                  selector: (row) => row?.status?.toUpperCase() || 'N/A',
                },
                {
                  name: 'Name',
                  selector: (row) => row?.name || 'N/A',
                },
                {
                  name: 'Price',
                  selector: (row) => {
                    if (row && !row.is_free) {
                      return (
                        <div className="eth-pricing">
                          <p>{`${row.price ? `$ ${row.price.toFixed(2)}` : 'N/A'}`}</p>
                          <p>{row.price ? `${(row.price / currentETHPrice).toFixed(4)} MATIC` : ''} </p>
                        </div>
                      );
                    }

                    if (row && row.is_free) {
                      return 'Free NFT';
                    } else {
                      return 'N/A';
                    }
                  },
                },
                {
                  name: 'Minted',
                  selector: (row) => row?.mintedCount || 'N/A',
                },
              ]}
              data={user?.nfts.sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at))}
              customStyles={tableStyles}
              pagination
              paginationRowsPerPageOptions={[10, 25, 50, 100]}
              paginationPerPage={10}
            />
          </div>

          <div className={'form-footer'}>
            <button onClick={handleBlock} className={'action-button outlined'}>
              {'Block user'}
            </button>
            <button onClick={showPopup} className={'action-button secondary'}>
              {'Reject user'}
            </button>
            <button onClick={handleAccept} className={'action-button primary'}>
              {'Accept user'}
            </button>
          </div>
        </div>
      </div>
    </DashContent>
  );
};
