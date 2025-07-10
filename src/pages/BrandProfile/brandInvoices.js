import React from 'react';
import NftsNavigation from "../../components/micro/NftsNavigation";
import DashContent from "../../components/micro/DashContent";
import {PageHeader} from "../../components/PageHeader";

const BrandInvoices = () => {
  return (
    <main className="main">
      <div className="main-wapr">
        <NftsNavigation kyc />
        <DashContent>

          <PageHeader
            tabs={false}
            title={"Invoices"}
            description={
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur neque nibh, facilisis sed accumsan in, laoreet id felis. Sed aliquet dolor sit amet laoreet faucibus. Donec vitae lectus mollis, vulputate ipsum id, vulputate lorem. Donec risus erat, molestie iaculis ligula eget, imperdiet blandit nisl. Maecenas lobortis elit eget eros iaculis. '
            }
          />

          <div className={'nft-content'}>
            <div className="container">
              TODO brand invoices
            </div>
          </div>
        </DashContent>
      </div>
    </main>
  );
};

export default BrandInvoices;
