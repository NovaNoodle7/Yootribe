import React from 'react';
import DataTable from 'react-data-table-component';
import { CampaignTableColumns } from './TableColumns';

export const tableStyles = {
  headRow: {
    style: {
      fontSize: 15,
      backgroundColor: '#f8f9fb',
      color: '#05506d',
      fontWeight: 'bold',
      borderBottom: 'none'
    }
  },
  headCells: {
    style: {
      padding: 10
    }
  },
  cells: {
    style: {
      fontSize: 15,
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'normal',
      color: '#2b2b2b',
      padding: 10,
      border: 'none',

      '& > div:first-child': {
        whiteSpace: 'unset!important',
        textAlignt: 'center'
      },

      '&:first-of-type': {
        paddingTop: '10px',
        paddingBottom: '10px',
        div: {
          width: '100%'
        }
      },
      '&:last-of-type': {
        div: {
          width: '100%'
        }
      }
    }
  },
  rows: {
    style: {
      backgroundColor: '#fff',
      '&:not(:last-of-type)': {
        borderBottomStyle: 'dashed',
        borderBottomColor: '#a6a6a6'
      },
      '&:last-of-type': {
        borderBottomStyle: 'dashed',
        borderBottomColor: '#a6a6a6'
      }
    }
  }
};

const CampaignTable = ({ nftData, type, setCurrentTab, currentTab }) => {
  const checkType = () => {
    switch (type) {
      case 'draft':
        return CampaignTableColumns({ setCurrentTab, currentTab }).draftColumns;
      case 'whitelisted':
        return CampaignTableColumns({ setCurrentTab, currentTab }).whitelistedColumns;
      case 'live':
        return CampaignTableColumns({ setCurrentTab, currentTab }).liveColumns;
      default:
        return CampaignTableColumns({ setCurrentTab, currentTab }).draftColumns;
    }
  };

  return (
    <div className="main-table-wrapper">
      <DataTable
        columns={checkType()}
        data={nftData}
        customStyles={tableStyles}
        pagination
        paginationRowsPerPageOptions={[5, 10]}
        paginationPerPage={10}
      />
    </div>
  );
};

export default CampaignTable;
