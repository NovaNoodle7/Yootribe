import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getInitialNft } from '../../store/nftSlice';
import { getInitialCampaigns } from '../../store/campaignSlice';

// Compionents
import WalletSidebar from '../../components/Wallet/Sidebar';
import SingleNFT from '../../components/Wallet/SingleNFT';
import SingleCampaign from '../../components/Wallet/SingleCampaign';
import UserAccount from '../../components/Wallet/UserAccount';
import UserPassword from '../../components/Wallet/Password';
// HELPER
import { useCurrentEthPrice } from '../../hooks/GetEthPrice';

// Icons
import YooTribeIcon from '../../assets/img/yootribe-wallet-figure.png';
import MetaMaskLogo from '../../assets/img/metamask-logo.png';
import SearchIcon from '../../assets/img/SEARCH.png';
import { WalletConnectIcon, XIconLight } from '../../assets/icons';
import ExportWallet from '../../components/Wallet/ExportWallet';
import ChatComponent from '../../components/ChatComponents/Chat';
import { Loading } from '../../components/Wallet/Loading';
import { useLocation } from 'react-router-dom';

const WalletPage = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();

  // Reducers
  const userData = useSelector((state) => state.auth.value.user);
  const nfts = useSelector((state) => state.nft.nfts);
  const campaigns = useSelector((state) => state.campaigns.draft);

  const currentETHPrice = useCurrentEthPrice()?.MATIC?.USD;

  // State
  const [currentTab, setCurrentTab] = useState('nfts');
  const [isNavigation, setIsNavigation] = useState('');
  const [activeSearch, setActiveSearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = React.useState(0.7);

  React.useEffect(() => {
    const loadingInterval = setInterval(() => {
      if (loading * 1 > 0) {
        setLoading(parseFloat(loading - 0.2).toFixed(1));
      }
    }, 300);

    return () => {
      clearInterval(loadingInterval);
    };
  }, [loading]);

  useEffect(() => {
    dispatch(getInitialNft({}));
  }, [dispatch]);

  const handleSearchEnter = useCallback(
    (event) => {
      const { key } = event;
      if (key === 'Enter' && activeSearch && searchInput !== '') {
        dispatch(getInitialCampaigns({ name: searchInput }));
        setSearched(true);
      }
    },
    [activeSearch, searchInput, dispatch]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleSearchEnter);
    return () => {
      window.removeEventListener('keydown', handleSearchEnter);
    };
  }, [handleSearchEnter]);

  return (
    <main className="main">
      <div className="main-wapr">
        {currentTab === 'create' && isNavigation === '' && (
          <div className="wallet-select-wrapper">
            <div className={'wallet-select-inner'}>
              <h2>Select a wallet</h2>
              <p>Select a wallet in order to aquire your NFT</p>
              <div className={'selector-wrapper'}>
                <div className={'single-select'}>
                  {/* <p className={'popular-tag'}>
                        Most popular
                      </p> */}
                  <div className={'select-content'}>
                    <img src={YooTribeIcon} alt={'yootribe-figure'} />
                    <h3>Welcome to Yootribe wallet</h3>
                    <p>
                      Enter a world of collaborative journey having access to all the all upcoming perks and privileges
                      !
                    </p>
                    <button>Click here</button>
                  </div>
                </div>
                <div className={'single-select'}>
                  <div className={'select-content'}>
                    <WalletConnectIcon />
                  </div>
                </div>
                <div className={'single-select'}>
                  <div className={'select-content'}>
                    <img src={MetaMaskLogo} alt={'metamask-wallet'} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className={'wallet-dash-wrapper'}>
          <div className="wallet-tabs-content">
            <Loading loading={loading} token={userData?.wallet_address} />

            {loading * 1 <= 0 && (
              <>
                {currentTab === 'nfts' && isNavigation === '' && (
                  <div className={'wallet-campaigns'}>
                    <div className={'campaigns-search'}>
                      <div className={'campaign-number'}>
                        <p>
                          You have <span>{nfts.length}</span> nft(s) in your <span>wallet</span>
                        </p>
                      </div>
                    </div>
                    {nfts.length > 0 &&
                      nfts.map((item) => (
                        <SingleNFT
                          campaigns={campaigns}
                          key={item._id}
                          nft={item}
                        />
                      ))}
                    {state?.firstLogin ? (
                      <div className={'no-content-notice'}>Thank you for creating your Yootribe wallet!</div>
                    ) : (
                      nfts.length === 0 && (
                        <div className={'no-content-notice'}>You currently do not have and NFTS listed.</div>
                      )
                    )}
                  </div>
                )}
                {currentTab === 'campaigns' && isNavigation === '' && (
                  <div className={'wallet-campaigns campaigns-tab'}>
                    <div className={'campaigns-search'}>
                      <div className={'campaign-number'}>
                        <p>
                          You have <span>{campaigns.length}</span> campaign(s) in your{' '}
                          <span>{searched ? 'search' : 'whitelist'}</span>
                        </p>
                      </div>
                      <div className={'search-bar'}>
                        <span>{searched ? searchInput : 'Search other great campaigns'}</span>
                        <button onClick={() => setActiveSearch((prev) => !prev)} type={'button'}>
                          <img src={SearchIcon} alt={'search'} />
                        </button>
                      </div>
                    </div>
                    <div className={`campaign-main-search ${activeSearch ? 'active' : ''}`}>
                      <div className={'input-wrapper'}>
                        <div className={'clear-input'}>
                          <input
                            onChange={(e) => setSearchInput(e.target.value)}
                            value={searchInput}
                            type={'text'}
                            placeholder={`Press enter key using 'Press Key' keyword`}
                          />
                          {searchInput !== '' && (
                            <button
                              onClick={() => {
                                dispatch(getInitialCampaigns({}));
                                setSearchInput('');
                                setSearched(false);
                              }}
                            >
                              <XIconLight />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            dispatch(getInitialCampaigns({ name: searchInput }));
                            setSearched(true);
                          }}
                          className={'action-button'}
                        >
                          Search
                        </button>
                      </div>
                      <div onClick={() => setActiveSearch((prev) => !prev)} className={'close-icon'}>
                        <XIconLight />
                      </div>
                    </div>
                    {campaigns.length > 0 &&
                      campaigns.map((item) => (
                        <SingleCampaign nfts={nfts} currentETHPrice={currentETHPrice} key={item._id} campaign={item} />
                      ))}
                    {campaigns.length === 0 && (
                      <div className={'no-content-notice'}>You currently do not have and Campaigns listed.</div>
                    )}
                  </div>
                )}
                {currentTab === 'friends' && isNavigation === '' && (
                  <div className={'wallet-campaigns campaigns-tab'}>
                    <div className={'wallet-friends-wrapper'}>
                      <ChatComponent />
                    </div>
                  </div>
                )}
                {isNavigation === 'account' && <UserAccount />}
                {isNavigation === 'password' && <UserPassword />}
                {isNavigation === 'export-wallet' && <ExportWallet />}
              </>
            )}
          </div>

          <WalletSidebar
            setIsNavigation={setIsNavigation}
            isNavigation={isNavigation}
            setCurrentTab={setCurrentTab}
            currentTab={currentTab}
          />
        </div>
      </div>
    </main>
  );
};

export default WalletPage;
