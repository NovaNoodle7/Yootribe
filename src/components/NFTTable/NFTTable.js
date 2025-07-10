import React from 'react';
import DataTable from 'react-data-table-component';
import { TableColumns } from './TableColumns';

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
      padding: 20
    }
  },
  cells: {
    style: {
      fontSize: 15,
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'normal',
      color: '#2b2b2b',
      padding: 20,
      border: 'none',

      '& > div:first-child': {
        whiteSpace: 'unset!important'
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

const NFTTable = ({ nftData, type, setCurrentTab, currentTab }) => {
  return (
    <div className="main-table-wrapper">
      <DataTable
        columns={TableColumns({ setCurrentTab, currentTab })}
        data={nftData}
        customStyles={tableStyles}
        pagination
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        paginationPerPage={10}
      />
    </div>
  );
};

export default NFTTable;
