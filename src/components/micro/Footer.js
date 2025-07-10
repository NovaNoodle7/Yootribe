import React from 'react';
import { Link } from 'react-router-dom';

import yootribeLogo from '../../assets/img/logo-yootribe.png';
import yootribeFooter from '../../assets/img/logo-footer-yootribe.jpg';

const Footer = () => {
  return (
    <footer>
      <div className="footer-wrapper container">
        <div className="item first">
          <a className="navbar-brand" href="/">
            <img src={yootribeLogo} alt="" />
          </a>
          <p>We are blockchain brand ready</p>
        </div>
        <ul className="footer-links-app">
          <li className="item">
            <a href="/terms" className="link">
              Terms
            </a>
          </li>
          <li className="item">
            <a href="/legal" className="link">
              Legal
            </a>
          </li>
          <li className="item">
            <a href="/privacy" className="link">
              Privacy Policy
            </a>
          </li>
          <li className="item">
            <a href="/antiabuse" className="link">
              Anti-abuse policy
            </a>
          </li>
        </ul>
        <div className="item last">
          <img src={yootribeFooter} alt={''} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
