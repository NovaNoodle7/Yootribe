import React from 'react';

import DashContent from '../../../components/micro/DashContent';
import { getNftsByStatus } from '../../../api';
import SuperAdminTable from '../../../components/NFTTable/SuperAdminTable';

export const AdminNFTPage = () => {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    getNftsByStatus('live')
      .then((data) => setData(data))
      .catch(console.error);
  }, []);

  return (
    <main className="main">
      <DashContent>
        <div className={'nft-content'}>
          <div className="container">
            <div className="table-responsive">
              {data?.length > 0 ? <SuperAdminTable nfts={data} /> : `Currently no listed NFT's`}
            </div>
          </div>
        </div>
      </DashContent>
    </main>
  );
};