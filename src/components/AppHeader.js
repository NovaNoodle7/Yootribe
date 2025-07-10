import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { HamburgerMenu, ProfileIcon2 } from '../assets/icons';
import headerNav from '../static/main-nav.json';
import { logout } from '../store/authSlice';
import { SideMenu } from './SideMenu';

const AppHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.value.user);
  const counts = useSelector((state) => state.dashboard.counts);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const dropdownHandler = (e) => {
    e.preventDefault();
    setShowDropdown((prev) => !prev);
  };

  const countData = {
    campaigns: counts?.campaigns?.total,
    nfts: counts?.nfts?.total,
    kyb: counts?.kyb?.total,
    users: counts?.users?.total,
    leads: counts?.leads?.total,
    reports: counts?.reports?.total,
  };

  const menuItems = headerNav.filter((item) => {
    if (user?.is_superadmin && item?.admin) {
      return true;
    } else if (!user?.is_superadmin && !item?.admin) {
      return true;
    }

    return false;
  });

  return (
    <>
      <header
        hidden={
          location.pathname === '/wallet' ||
          location.pathname.includes('get-nft') ||
          location.pathname.includes('confirm-email') ||
          location.pathname.includes('create-wallet')
        }
        id={'app-header'}
      >

        {(!user.kyb_passed && !user.is_superadmin) && (
          <div className="col-12 errors">
            <div className="container text-black">
              You must validate your KYB to submit campaign <a className={'text-black'} href={'/dashboard'} style={{ fontWeight: 'bold' }} >by clicking here</a>
            </div>
          </div>
        )}

        <div className={'header-inner-wrapper container'}>
          <div className={'header-top'}>
            <div className={'main-logo'}>
              <a href="/dashboard">
                <img src="/images/logo.png" alt={'main application'} />
              </a>
            </div>
            <div className={'header-nav'}>
              <div className={'main-nav'}>
                {menuItems.map((item, index) => {
                  return (
                    <button
                      key={index + 1}
                      className={`single-nav-button ${location.pathname.includes(item.path) ? 'active' : ''}`}
                      onClick={() => navigate(item.path)}
                    >
                      {item.pathName}
                      {item?.count && <span className={'current-counter'}>{countData[item?.count]}</span>}
                    </button>
                  );
                })}
              </div>
              <div className="right-column">
                <div className="right-items">
                  <div className={'profile'}>
                    <button onClick={dropdownHandler}>
                      <ProfileIcon2 />

                      {user?.first_name && user?.last_name && (
                        <span className="user_name">
                          {user?.first_name} {user?.last_name}
                        </span>
                      )}
                      {/* <div className={'notifications'}></div> */}
                    </button>
                  </div>
                  <HamburgerMenu
                    className={`mobile-menu-button ${showMobileMenu ? 'active' : ''}`}
                    onClick={() => setShowMobileMenu(true)}
                  />
                </div>
                <p className={'help'}>
                  Need some help? <a href="#">Click here</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <SideMenu
        isOpen={showDropdown}
        closeMenu={() => setShowDropdown(false)}
        links={[
          <NavLink to="/dashboard/user/profile">Account Profile (KYC)</NavLink>,
          <NavLink to="/dashboard/company/profile">Company Profile (KYB)</NavLink>,
          <NavLink to="/dashboard/user/security">Account Security</NavLink>,
          <NavLink to="/dashboard/company/invoices">Invoices</NavLink>,
          <button
            onClick={(e) => {
              e.preventDefault();
              dispatch(logout());
            }}
          >
            Logout
          </button>,
        ]}
      />

      <SideMenu
        isOpen={showMobileMenu}
        closeMenu={() => setShowMobileMenu(false)}
        links={menuItems.map((item, index) => {
          return (
            <button
              key={index + 1}
              className={`single-nav-button ${location.pathname.includes(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.pathName}
              {item?.count && <span className={'current-counter'}>{countData[item?.count]}</span>}
            </button>
          );
        })}
      />
    </>
  );
};

export default AppHeader;
