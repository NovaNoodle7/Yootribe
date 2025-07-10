import React from 'react';
import DataTable from 'react-data-table-component';

import { useCurrentEthPrice } from '../../hooks/GetEthPrice';

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

const SuperAdminTable = ({ nfts }) => {
  const currentETHPrice = useCurrentEthPrice()?.MATIC?.USD;

  const SuperAdminColumns = [
    {
      name: 'NFT Name',
      selector: (row) => row?.name || 'N/A',
    },
    {
      name: 'Campaign',
      selector: (row) => row?.campaign?.name || 'N/A',
    },
    {
      name: 'Description',
      selector: (row) => row?.description || 'N/A',
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
      name: 'Supply',
      selector: (row) => row?.copies || 'N/A',
    },
    {
      name: 'Sold',
      selector: (row) => row?.leads?.length || 'N/A',
    },
    {
      name: 'Total',
      selector: (row) => {
        if (row && !row.is_free) {
          return (
            <div className="eth-pricing">
              <p>{`${row.price ? `$ ${row?.nft?.leads?.length * row.price.toFixed(2)}` : 'N/A'}`}</p>
              <p>{row.price ? `${row?.nft?.leads?.length * (row.price / currentETHPrice).toFixed(4)} MATIC` : ''} </p>
            </div>
          );
        } else {
          return 'N/A';
        }
      },
    },
    {
      name: 'NFT Image',
      selector: (row) => (
        <div className="table-image-wrapper">
          {row?.image ? (
            <img className={'table-image'} src={`${process.env.REACT_APP_API}/uploads/${row?.image}`} alt={row.name} />
          ) : (
            <img className={'table-image'} src={NoImage} alt={row.name} />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="main-table-wrapper">
      <DataTable
        responsive
        columns={SuperAdminColumns}
        data={nfts}
        customStyles={tableStyles}
        pagination
        paginationRowsPerPageOptions={[5, 10]}
        paginationPerPage={10}
      />
    </div>
  );
};

export default SuperAdminTable;
