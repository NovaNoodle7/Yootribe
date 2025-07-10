import moment from 'moment';
import React from 'react';
import DataTable from 'react-data-table-component';

import DashContent from '../../../../components/micro/DashContent';
import { useCurrentEthPrice } from '../../../../hooks/GetEthPrice';
import { tableStyles } from '../../Reports/components/FraudTab';

import BackIcon from '../../../../assets/icons/back-icon.png';
import NoImage from '../../../../assets/img/no-image.png';

export const LeadView = ({ data, closeView }) => {
  const currentETHPrice = useCurrentEthPrice()?.MATIC?.USD;

  return (
    <DashContent>
      <div className={'nft-content'}>
        <div className="container">
          <h4 onClick={closeView} className="mb-5" style={{ color: '#38d8ec', cursor: 'pointer' }}>
            <img src={BackIcon} alt="back icon" className="me-2" />
            Leads
          </h4>

          <div className="row">
            <div className="col-md row">
              <div className="col-md-6">
                <p>ID : {data?._id}</p>
                <p>First Name : {data?.first_name}</p>
                <p>Last Name : {data?.last_name}</p>
                <p>Email : {data?.email}</p>
                <p>Phone Number : {data?.phone}</p>
                <p>Acquired NFT : {data?.nfts?.length > 0 ? 'Yes' : 'No'}</p>
              </div>
            </div>
            <div className="col-md-auto" style={{ borderLeft: '1px solid #000 ' }}>
              <img
                className={'table-image'}
                src={data?.image ? `${process.env.REACT_APP_API}/uploads/${data?.image}` : NoImage}
                alt={data.campaign?.name}
                width="150px"
                height="150px"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          <div className="mt-5">
            <DataTable
              columns={[
                {
                  name: 'Date',
                  selector: (row) => moment(row?.created_at).format('DD/MM/YY'),
                },
                {
                  name: 'Campaign Name',
                  selector: (row) => row?.name || 'N/A',
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
              ]}
              data={data?.campaigns.sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at))}
              customStyles={tableStyles}
              pagination
              paginationRowsPerPageOptions={[10, 25, 50, 100]}
              paginationPerPage={10}
            />
          </div>
        </div>
      </div>
    </DashContent>
  );
};
