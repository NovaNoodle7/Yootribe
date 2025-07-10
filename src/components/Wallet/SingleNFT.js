import React, { useContext } from 'react';
import { useCurrentEthPrice } from '../../hooks/GetEthPrice';
import { ToastContext } from '../../context/ToastContext';
import Tooltip from '../Tooltip';

// ICONS
import { CopyIcon, ChainCryptoIcon } from '../../assets/icons';
import UserIcon from '../../assets/img/user.png';
import OpenSeaIcon from '../../assets/img/opensea.png';
import ArrowsIcon from '../../assets/img/arrows.png';

const SingleNFT = ({ nft }) => {
  const currentETHPrice = useCurrentEthPrice()?.MATIC?.USD;
  const { handleToast } = useContext(ToastContext);

  return (
    <div className={'single-wallet-campaign'}>
      <div className={'campaign-logo'}>
        {nft.image && <img src={`${process.env.REACT_APP_API}/uploads/${nft.image}`} alt={'uploaded'} />}
      </div>
      <div className={'campaign-content'}>
        <h3>
          {nft.name}
          <Tooltip text={'https://testnets.opensea.io/assets/mumbai/' + nft.address}>
            <p
              onClick={() => {
                navigator.clipboard.writeText('https://testnets.opensea.io/assets/mumbai/' + nft.address);
                handleToast(
                  `${
                    'https://testnets.opensea.io/assets/mumbai/' +
                    nft?.address.substring(0, 9) +
                    '...' +
                    nft?.address?.slice(-5)
                  } copied to clipboard`,
                  'success'
                );
              }}
            >
              {'https://testnets.opensea.io/assets/mumbai/' +
                nft?.address.substring(0, 9) +
                '...' +
                nft?.address?.slice(-5)}
              <CopyIcon />
            </p>
          </Tooltip>
        </h3>
        <p>{nft.description.length > 541 ? nft.description.substring(0, 541) + '...' : nft.description}</p>
        <div className={'campaign-info'}>
          <p>
            <b>Campaign:</b>{' '}
            <a target="_blank" href={`/auth/register/campaign/${nft?.campaign?.slug}`} rel="noreferrer">
              {nft?.campaign?.title || 'N/A'}
            </a>
          </p>
          <div className={'nft-data'}>
            {nft.price !== null && !nft.is_free && (
              <div className={'nft-price'}>
                <span className={'eth-icon'}>
                  <ChainCryptoIcon style={{ marginRight: '3px' }} />
                  {(nft.price / currentETHPrice).toFixed(2)}
                </span>
                <span>{`$${nft.price}`}</span>
              </div>
            )}
            {nft.is_free && <p>This NFT is free</p>}
            <div className={'bought-count'}>
              <img src={UserIcon} alt={'user'} /> {nft?.leads?.length}
            </div>
          </div>
        </div>
      </div>
      <div className={'campaign-actions'}>
        <div className={'campaign-tags'}>
          <span className={'single-tag'}># Esports</span>
          <span className={'single-tag'}># Gaming</span>
          <span className={'single-tag'}># Music</span>
        </div>
        <div className={'campaign-action-buttons'}>
          <button>
            <span>
              <img src={ArrowsIcon} alt={'arrow'} />
              Transfer to another wallet
            </span>
          </button>
          <span className="divider" />
          <button>
            <span>
              <img src={OpenSeaIcon} alt={'opensea'} />
              Transfer to Opensea
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleNFT;
