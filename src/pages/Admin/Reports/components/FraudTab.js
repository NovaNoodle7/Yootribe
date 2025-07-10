import moment from 'moment';
import React from 'react';
import DataTable from 'react-data-table-component';

import { deleteReport, getReports } from '../../../../api/requests/Reports';
import DashContent from '../../../../components/micro/DashContent';

import TrashIcon from '../../../../assets/icons/trash.png';

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

export const FraudTab = ({ setActiveReport }) => {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    getReports()
      .then((res) => {
        setData(res?.reports);
      })
      .catch(console.error);
  }, []);

  const handleDelete = (id) => {
    deleteReport(id)
      .then((res) => {
        setData(res?.reports);
      })
      .catch(console.error);
  };

  return (
    <DashContent>
      <div className={'nft-content'}>
        <div className="container">
          <div className="table-responsive">
            {data.length > 0 ? (
              <div className="main-table-wrapper">
                <DataTable
                  columns={[
                    {
                      name: 'Date',
                      selector: (row) => moment(row?.created_at).format('DD/MM/YY'),
                    },
                    {
                      name: 'ID',
                      selector: (row, i) => i + 1,
                    },
                    {
                      name: 'Campaign',
                      selector: (row) => row?.campaign?.name,
                    },
                    {
                      name: 'Message',
                      selector: (row) => row.message,
                    },
                    {
                      name: '',
                      selector: (row) => (
                        <>
                          <button onClick={() => handleDelete(row?._id)}>
                            <img src={TrashIcon} alt="edit" />
                          </button>
                        </>
                      ),
                    },
                  ]}
                  data={data.sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at))}
                  customStyles={tableStyles}
                  onRowClicked={(row) => setActiveReport(row)}
                  pagination
                  paginationRowsPerPageOptions={[10, 25, 50, 100]}
                  paginationPerPage={10}
                />
              </div>
            ) : (
              `Database is empty! All good!`
            )}
          </div>
        </div>
      </div>
    </DashContent>
  );
};
