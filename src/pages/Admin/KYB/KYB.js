import React from 'react';
import DataTable from 'react-data-table-component';

import DashContent from '../../../components/micro/DashContent';
import { getAllKYB } from '../../../api';
import { tableStyles } from '../Reports/components/FraudTab';
import { BrandView } from '../Brands/components/BrandView';

export const AdminKYBPage = () => {
  const [data, setData] = React.useState([]);
  const [viewData, setViewData] = React.useState(null);

  React.useEffect(() => {
    getAllKYB()
      .then(({ kyb }) => setData(kyb))
      .catch(console.error);
  }, []);

  const handleCloseView = () => {
    setViewData(null);

    getAllKYB()
      .then(({ kyb }) => setData(kyb))
      .catch(console.error);
  }

  return (
    <main className="main">
      {viewData ? (
        <BrandView data={viewData} closeView={handleCloseView} />
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
                          name: 'State',
                          selector: (row) => row?.state || 'N/A',
                        },
                        {
                          name: 'Company Name',
                          selector: (row) => row?.user?.company || 'N/A',
                        },
                        {
                          name: 'First Name',
                          selector: (row) => row?.user?.first_name || 'N/A',
                        },
                        {
                          name: 'Last Name',
                          selector: (row) => row?.user?.last_name || 'N/A',
                        },
                        {
                          name: 'Title',
                          selector: (row) => row?.user?.job_title || 'N/A',
                        },
                        {
                          name: 'Country',
                          selector: (row) => row?.user?.company_location || 'N/A',
                        },
                        {
                          name: 'Email',
                          selector: (row) => row?.user?.email || 'N/A',
                        },
                        {
                          name: 'URL',
                          selector: (row) => row?.user?.company_website || 'N/A',
                        },
                        {
                          name: 'KYB Filled',
                          selector: (row) =>
                            row?.user?.company && row?.user?.company_location && row?.user?.company_website
                              ? 'Yes'
                              : 'No',
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
