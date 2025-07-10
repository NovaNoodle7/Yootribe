import React, { useState, useContext, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContext } from '../../context/ToastContext';

import useEmblaCarousel from 'embla-carousel-react';
import Tooltip from '../Tooltip';

import { logout } from '../../store/authSlice';

// Icons / Images
import YooTribeLogo from '../../assets/img/logo-yootribe.png';
import WalletIcon from '../../assets/img/wallet-icon.png';
import AppsIcon from '../../assets/img/APPS.png';
import SwapIcon from '../../assets/img/SWAP.png';
import TransactionIcon from '../../assets/img/TRANSACTION.png';
import TokensIcon from '../../assets/img/TOKENS.png';
import LeftArrow from '../../assets/img/left-arrow.png';
import RightArrow from '../../assets/img/right-arrow.png';
import BellIcon from '../../assets/img/bell.png';
import BurgerMenuIcon from '../../assets/img/burger-menu.png';
import ArrowsIcon from '../../assets/img/arrows-down.png';
import { CopyIcon, XIcon } from '../../assets/icons';

const WalletSidebar = (props) => {
  const dispatch = useDispatch();
  const { handleToast } = useContext(ToastContext);
  const userData = useSelector((state) => state?.auth?.value?.user);

  const { currentTab, setCurrentTab, isNavigation, setIsNavigation } = props;
  const adRef = useRef(null);

  const [openMenu, setOpenMenu] = useState(false);

  const [viewportRef, embla] = useEmblaCarousel({
    loop: false,
    skipSnaps: false
  });

  // CAROUSEL
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);
  const onSelect = useCallback(() => {
    if (!embla) return;
    setPrevBtnEnabled(embla.canScrollPrev());
    setNextBtnEnabled(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    embla.on('select', onSelect);
    onSelect();
  }, [embla, onSelect]);

  // TABS
  const handleTabs = (type) => {
    setCurrentTab(type);
    setIsNavigation('');
  };

  const scrollToBotHandler = () => {
    adRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className={'wallet-sidebar-wrapper'}>
      <div className={'wallet-tabs'}>
        <button
          onClick={() => handleTabs('nfts')}
          className={currentTab === 'nfts' && !isNavigation ? 'active' : ''}>
          Your NFTS
        </button>
        <button
          onClick={() => handleTabs('campaigns')}
          className={currentTab === 'campaigns' && !isNavigation ? 'active' : ''}>
          Campaigns
        </button>
        <button
          onClick={() => handleTabs('friends')}
          className={currentTab === 'friends' ? 'active' : ''}>
          Friends
        </button>
        <button
          onClick={() => handleTabs('market')}
          className={currentTab === 'market' ? 'active' : ''}>
          Market
        </button>
      </div>
      <div className={'content-wrapper'}>
        <div className={'wallet-content'}>
          <div className={'wallet-content-header'}>
            <div className="logo">
              <img src={YooTribeLogo} alt={'company'} />
            </div>
            <div className={'notifications-menu'}>
              <button>
                <img src={BellIcon} alt={'tokens'} />
                <span>2</span>
              </button>
              <button className={'menu-opener'} onClick={() => setOpenMenu((prev) => !prev)}>
                {!openMenu ? <img src={BurgerMenuIcon} alt={'tokens'} /> : <XIcon />}
              </button>
            </div>
          </div>
          <div className={`wallet-info-wrapper ${openMenu ? 'hidden' : ''}`}>
            <div className={'wallet-info'}>
              {userData?.image && (
                <img className={'user-avatar'} src={`/uploads/${userData?.image}`} alt={'wallet'} />
              )}
              {!userData?.image && <div className={'add-avatar'}></div>}
              <h3>{userData?.first_name} wallet</h3>
              <div className={'wallet-address'}>
                <Tooltip text={userData?.wallet_address}>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(userData.wallet_address);
                      handleToast(
                        `${
                          userData?.wallet_address?.substring(0, 9) +
                          '...' +
                          userData?.wallet_address?.slice(-5)
                        } copied to clipboard`,
                        'success'
                      );
                    }}>
                    {userData?.wallet_address?.substring(0, 9) +
                      '...' +
                      userData?.wallet_address?.slice(-5)}
                    <CopyIcon />
                  </button>
                </Tooltip>
              </div>
              <div className={'wallet-actions-wrapper'}>
                <button>
                  <img src={TokensIcon} alt={'tokens'} />
                  Tokens
                </button>
                <button>
                  <img src={TransactionIcon} alt={'transaction'} />
                  Transaction
                </button>
                <button>
                  <img src={SwapIcon} alt={'swap'} />
                  Swap
                </button>
                <button>
                  <img src={AppsIcon} alt={'apps'} />
                  Apps
                </button>
              </div>
              <div className={'wallet-balance'}>
                <h3>Total balance</h3>
                <p className={'eth'}>
                  0,24 <span>MATIC</span>
                </p>
                <p className={'fiat'}>321 $</p>
                <button>Add funds</button>
              </div>
              <button onClick={() => scrollToBotHandler()} className={'scroll-down-icons'}>
                <img src={ArrowsIcon} alt={'arrows-icons'} />
              </button>
            </div>
            <div className={`wallet-nav ${openMenu ? '' : 'hidden'}`}>
              <button
                onClick={() => setIsNavigation('notifications')}
                className={`${isNavigation === 'notifications' ? 'active' : ''}`}>
                Notifications
              </button>
              <button
                onClick={() => setIsNavigation('account')}
                className={`${isNavigation === 'account' ? 'active' : ''}`}>
                User Account
              </button>
              <button
                onClick={() => setIsNavigation('password')}
                className={`${isNavigation === 'password' ? 'active' : ''}`}>
                Security
              </button>
              <button
                onClick={() => setIsNavigation('export-wallet')}
                className={`${isNavigation === 'export-wallet' ? 'active' : ''}`}>
                Export Wallet
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  localStorage.removeItem('keywords');
                  localStorage.removeItem('singleUser');
                  dispatch(logout());
                }}>
                Log out
              </button>
            </div>
          </div>
        </div>
        <div className={'wallet-ad'}>
          <div className={'carousel-buttons'}>
            <button disabled={!prevBtnEnabled} onClick={scrollPrev}>
              <img src={LeftArrow} alt={'left-arrow'} />
            </button>
            <button disabled={!nextBtnEnabled} onClick={scrollNext}>
              <img src={RightArrow} alt={'right-arrow'} />
            </button>
          </div>
          <div ref={adRef} className={'carousel-ads'}>
            <div className="embla" ref={viewportRef}>
              <div className="embla__container">
                {Array.from('012').map((item, index) => (
                  <div key={index + 1} className="embla__slide">
                    <div className="embla__slide__inner">
                      <h3>NFT Drop coming soon!</h3>
                      <h4>The first ever Auto-Staking Loyality NFT reward into a DAO</h4>
                      <p>
                        Pioneers taking part in this adventure will follow Yootribe brands sponsors
                        on a collaborative journey having access to all the upcoming perks and
                        privileges.
                      </p>
                      <button>Sign now</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletSidebar;
