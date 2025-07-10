import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { useMediaQuery } from 'react-responsive';

import { loginAuthUser, userForgotPassword } from '../../../api/requests/Auth';
import { login } from '../../../store/authSlice';
import { ForgotPassword } from '../ForgotPassword/ForgotPassword';

import LoginBg from '../../../assets/img/login-bg1.png';
import planeLogin from '../../../assets/img/plane.png';
import ConnexionIcon from '../../../assets/img/connexion.png';

import AddAccount from '../../../assets/img/add-account.png';

import BgConsumerRed from '../../../assets/img/img_login/background.png';
import Hill from '../../../assets/img/img_login/coline1.png';
import GalaxyConsumer from '../../../assets/img/img_login/etoile.png';
import GalaxyConsumerMobile from '../../../assets/img/img_login/etoile_mobile.png';
import Star from '../../../assets/img/img_login/etoile2.png';
import Shadow from '../../../assets/img/img_login/ombre.png';
import PlaneBrand from '../../../assets/img/img_login/plane2.png';
import PlaneBrandMobile from '../../../assets/img/img_login/plane2_mobile.png';
import Alien from '../../../assets/img/img_login/robot.png';
import Astronote from '../../../assets/img/img_login/robot2.png';

import '../bootstrap.min.css';
import '../style.css';

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.auth.value.user);

  const [showForgotPassword, setShowForgotPassword] = React.useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = React.useState(false);

  const [loginData, setLoginData] = React.useState({});
  const [formError, setFormError] = React.useState(null);
  const [formErrorLogin, setFormErrorLogin] = React.useState('');
  const [formErrorForgot, setFormErrorForgot] = React.useState('');

  const [mobileView, setMobileView] = React.useState(false);


  React.useEffect(() => {
    if (user && user.confirmed) {
      if (!user.wallet) {
        navigate('/dashboard');
      } else {
        navigate('/wallet');
      }
    }
    
  }, [user, navigate]);

  const onValueChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const onAuthLogin = (e) => {
    e.preventDefault();

    loginAuthUser({ ...loginData })
      .then(({ user, token }) => {
        if (location?.state?.redirect) {
          localStorage.setItem('token', token);
          dispatch(login({ user }));
          navigate(location?.state?.redirect);
          return;
        }

        if (user.wallet && !user.confirmed) {
          setFormErrorLogin('You must confirm your wallet account before you can login.');
          return;
        }

        if (!user.wallet && !user.is_superadmin && !user.confirmed) {
          setFormErrorLogin('You must confirm your email address before you can login.');
          return;
        }
        localStorage.setItem('token', token);
        dispatch(login({ user }));
        navigate('/dashboard');
      })
      .catch((error) => {
        setFormErrorLogin(error.message);
      });
  };


  const onForgotPassword = (e) => {
    e.preventDefault();

    userForgotPassword({
      email: loginData.email,
    })
      .then(() => {
        setShowResetPasswordModal(true);
      })
      .catch((error) => {
        setFormErrorForgot(error.message);
      });
  };


  const Galaxy = () => {
    const isTabletOrMobile = useMediaQuery({ maxWidth: 768 });
    if (isTabletOrMobile === true) {
      return (<img src={GalaxyConsumerMobile} alt="consumer Galaxy" className='consumer_Galaxy_mobile' />);
    } else {
      return (<img src={GalaxyConsumer} alt="consumer Galaxy" className='consumer_Galaxy' />);
    }
  }

  const BrandPlane = () => {
    const isTabletOrMobile = useMediaQuery({ maxWidth: 768 });
    if (isTabletOrMobile === true) {
      return (<img src={PlaneBrandMobile} alt="brand login plane mobile" className='brand_plane_mobile' />);
    } else {
      return (<img src={PlaneBrand} alt="brand login plane" className='brand_plane' />);
    }
  }

  const handleChangeViewMobile = () => {
    setMobileView(!mobileView);
  }

  return (
    <div className="login-page">
      <div className='header-mobile'>
        <div className='content-header-mobile'>
          <h1 className='titre-mobile'>Yootribe</h1>
          <div className='content-action' onClick={handleChangeViewMobile}>
            <span>{mobileView === false ? "Connect" : "Create an account"}</span>
            {mobileView === false ? <img src={ConnexionIcon} alt='hand icon' /> : <img src={AddAccount} alt='hand icon' />}

          </div>
        </div>
      </div>
      <div className="login-container">
        <div className={mobileView === false ? "switch-routes" : "switch-routes switch-routes-hide"}>
          <div className="switch-item">
            <img src={BgConsumerRed} alt="consumer bg img" className='consumer_bg' />
            <img src={Shadow} alt="consumer shadow" className='consumer_shadow' />
            <img src={Alien} alt="aliene" className='consumer_alien' />
            <img src={Hill} alt="consumer Hill" className='consumer_hill' />
            {Galaxy()}
            <img src={Astronote} alt="astronote" className='consumer_astronote' />
            <div className="content container-mobile-user">
              <div className="content-consumer">
                <p>I AM A</p>
                <h2>CONSUMER</h2>
                <p className='text-upper-mobile'>I WANT NFT</p>
              </div>

              <button className="btn" onClick={() => navigate('/auth/register/wallet')}>
                Give it to me baby
              </button>
            </div>
          </div>
          <div className="switch-item" style={{ background: "#1c86ab" }}>
            {BrandPlane()}
            <img src={Star} alt="brand login start" className='brand_start' />
            <div className='plane_img'>
              <img src={planeLogin} alt="plane login" />
            </div>
            <div className="content container-mobile-brand">
              <div className='content-brand'>
                <p>I AM A</p>
                <h2>BRAND</h2>
                <p className='text-upper-mobile'>I WANT TO DISTRIBUTE NFT</p>
              </div>
              <button className="btn" onClick={() => navigate('/auth/register/user')}>
                Create an account
              </button>
            </div>
          </div>
        </div>

        <div className={mobileView === false ? 'switch-item  switch-item-mobile' : 'switch-item'}>
          <img src={LoginBg} alt="brand login img" />

          <div className="content">
            {!showForgotPassword && (
              <div>
                <p className='text-upper-connect'>You have an account</p>
                <h3>Connect</h3>

                {formErrorLogin && <div className="input-line errors">{formErrorLogin}</div>}
                <form className="username-login-form" onSubmit={onAuthLogin}>
                  <div className="input-line">
                    <input
                      type="text"
                      name="email"
                      className="form-control"
                      placeholder="Enter your email"
                      onChange={onValueChange}
                    />
                  </div>
                  <div className="input-line">
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Enter your password"
                      onChange={onValueChange}
                    />

                    <div className="input-line-info">
                      <a
                        className="forgot-pass-button"
                        href={'#forgot-password'}
                        onClick={(e) => {
                          e.preventDefault();
                          setFormErrorForgot('');
                          setFormErrorLogin('');
                          setShowForgotPassword(true);
                        }}
                      >
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  <div className="input-line input-actions">
                    <button type="submit" className="btn">
                      Let’s go
                    </button>
                  </div>
                </form>
              </div>
            )}

            {showForgotPassword && (
              <div className="forgotPassword">
                <h3>Recover your password</h3>

                <form className="forgot-password-form" onSubmit={onForgotPassword}>
                  <p style={{ marginBottom: '14px' }}>Enter email address associated with your account</p>
                  <div style={{ marginTop: '14px' }} className="input-line input-groups">
                    <input
                      type="email"
                      name="email"
                      className="form-control forgot-pass-input"
                      placeholder="Enter your email"
                      onChange={onValueChange}
                    />
                    {formErrorForgot && <div className="input-line errors">{formErrorForgot}</div>}
                  </div>
                  <div className="input-line-info">
                    <a
                      className="back-to-login"
                      href={'#back-to-login'}
                      onClick={(e) => {
                        e.preventDefault();
                        setFormErrorForgot('');
                        setFormErrorLogin('');
                        setShowForgotPassword(false);
                      }}
                    >
                      Back to login
                    </a>
                  </div>
                  <div className="input-line input-actions">
                    <button style={{ padding: '0.375rem 25px' }} type="submit" className="btn btn-light btn-forgotPassword">
                      Recover my password
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <ForgotPassword
        show={showResetPasswordModal}
        closeModal={() => {
          setShowResetPasswordModal(false);
          setShowForgotPassword(false);
        }}
        email={loginData.email}
      />
    </div>
  );
};
