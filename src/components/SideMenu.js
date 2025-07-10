import React from 'react';
import goback  from '../assets/icons/goback.png';

export const SideMenu = ({ isOpen, closeMenu, links = [] }) => {
  return (
    <>
      <div className={`side-menu-overlay ${isOpen ? 'show' : ''}`} onClick={closeMenu} />
      <div className={`side-menu ${isOpen ? 'open' : ''}`}>
        <div className="header d-flex justify-content-end">
          <img src={goback} alt="go back img" onClick={closeMenu} className="goBack" />
        </div>

        <div className='d-flex justify-content-center'>
          <ul>
            {links.map((link, iLink) => (
              <li key={iLink} onClick={closeMenu}>{link}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
