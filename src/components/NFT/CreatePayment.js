import React from 'react';
import { useSelector } from 'react-redux';

import DashContent from '../micro/DashContent';
import EUCountries from '../../config/euCountries.json';

import web2 from '../../assets/img/psp.png';
import web3 from '../../assets/img/web-3.png';
import openBanking from '../../assets/img/open-banking.png';
import bankCards from '../../assets/img/bank-cards.png';

const CreateNFTPayment = ({ nftData, setNftData, handleDraftNft, setCurrentTab }) => {
  const user = useSelector((state) => state.auth?.value?.user);
  
  const isCountryEU = EUCountries.some(
    (country) => user?.company_location.includes(country) || country.includes(user?.company_location)
  );

  const vatAmount = isCountryEU ? 20 : 0;
  let total = 3 * nftData.copies;
  let vat = (vatAmount / 100) * total;
  let fee = (15 / 100) * total;

  const formatNumber = (number) => {
    number = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(number);

    return number;
  };

  return (
    <DashContent>
      <div className="nft-content">
        <div className="payment-wrapper container">
          <h3>Payment details</h3>
          <div className="payment-lines">
            <div className="payment-line">
              <span className="title">NFT Service Fee</span>
              <span className="cost">
                {nftData.copies} x {formatNumber(3)} = {formatNumber(nftData.copies * 3)}
              </span>
            </div>
            <div className="payment-line">
              <span className="title">Network fee ( include Polygon gas fees )</span>
              <span className="cost">{formatNumber(fee)}</span>
            </div>
            <div className="payment-line">
              <span className="title">VAT ({vatAmount}%)</span>
              <span className="cost">{formatNumber(vat)}</span>
            </div>
            <div className="payment-line payment-line-last">
              <span className="title">Total to pay</span>

              <span className="cost">{formatNumber(total + vat + fee)}</span>
            </div>
          </div>

          <div className="methods-listing">
            <p className="methods-listing-title">Please select your payment method</p>
            <div className="methods">
              <div className="method">
                <span>OPEN BANKING</span>
                <img src={openBanking} />
                <p>
                  Instant payments from
                  <br /> your bank account
                </p>
                <p className="bar">Bank transfert less than 35 seconds</p>
              </div>
              <div className="method">
                <span>WEB 2</span>
                <img src={web2} />
                <p>Pay with your credit cart</p>
                <img src={bankCards} className="mt-1" />
              </div>
              <div className="method">
                <span>WEB 3</span>
                <img src={web3} />
                <p>
                  Connect your wallet and <br />
                  pay with cryptos
                </p>
              </div>
            </div>
          </div>
          <div className="form-footer">
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                marginTop: '30px',
                gap: '20px',
              }}
            >
              <button
                type={'button'}
                onClick={(e) => {
                  setCurrentTab('confirmation');
                }}
                className={'action-button secondary back'}
              >
                Go back
              </button>
              <button
                onClick={() => {
                  handleDraftNft(nftData);
                }}
                className={'action-button secondary'}
              >
                {'Save draft'}
              </button>
              <button className="action-button primary" onClick={() => setCurrentTab('finish')}>
                {'Validate'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashContent>
  );
};

export default CreateNFTPayment;
