import React from 'react';
import { PageHeader } from '../../components/PageHeader';

const BrandWallet = () => {

  return (
    <main className="main">
      <PageHeader
        tabs={false}
        currentTab={"My Wallet"}
        title={"My Wallet"}
        description={
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur neque nibh, facilisis sed accumsan in, laoreet id felis. Sed aliquet dolor sit amet laoreet faucibus. Donec vitae lectus mollis, vulputate ipsum id, vulputate lorem. Donec risus erat, molestie iaculis ligula eget, imperdiet blandit nisl. Maecenas lobortis elit eget eros iaculis. '
        }
      />

      <div className={'nft-content'}>
        <div className="container">
          TODO brand wallet page
        </div>
      </div>
    </main>
  );
};

export default BrandWallet;
