import React from 'react';
import DataTable from 'react-data-table-component';

import DashContent from '../../../components/micro/DashContent';
import { getAllLeads } from '../../../api';
import { tableStyles } from '../Reports/components/FraudTab';
import { LeadView } from './components/LeadView';

import NoImage from '../../../assets/img/no-image.png';

export const AdminLeadsPage = () => {
  const [data, setData] = React.useState([]);
  const [viewData, setViewData] = React.useState(null);

  React.useEffect(() => {
    getAllLeads()
      .then(({ leads }) => setData(leads))
      .catch(console.error);
  }, []);

  return (
    <main className="main">
      {viewData ? (
        <LeadView data={viewData} closeView={() => setViewData(null)} />
      ) : (
        <DashContent>
          <div className={'nft-content'}>
            <div className="container">
              <div className="table-responsive">
                {data.length > 0 ? (
                  <div className="main-table-wrapper">
                    <DataTable
                      columns={[
                        {
                          name: 'First Name',
                          selector: (row) => row?.first_name || 'N/A',
                        },
                        {
                          name: 'Last Name',
                          selector: (row) => row?.last_name || 'N/A',
                        },
                        {
                          name: 'Email',
                          selector: (row) => row?.email || 'N/A',
                        },
                        {
                          name: 'Phone Number',
                          selector: (row) => row?.phone || 'N/A',
                        },
                        {
                          name: 'Acquired NFT?',
                          selector: (row) => (row?.nfts?.length > 0 ? 'Yes' : 'No'),
                        },
                        {
                          name: 'Avatar',
                          selector: (row) => (
                            <div className="table-image-wrapper">
                              {row?.image ? (
                                <img
                                  className={'table-image'}
                                  src={`${process.env.REACT_APP_API}/uploads/${row?.image}`}
                                  alt={row?.username}
                                />
                              ) : (
                                <img className={'table-image'} src={NoImage} alt={row?.nft?.name} />
                              )}
                            </div>
                          ),
                        },
                      ]}
                      data={data.sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at))}
                      customStyles={tableStyles}
                      onRowClicked={(row) => setViewData(row)}
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
      )}
    </main>
  );
};
