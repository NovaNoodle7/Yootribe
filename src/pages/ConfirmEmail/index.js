import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Reload from '../../assets/img/reload.svg';

import { ApiAxios } from '../../api/Api';
import {login, updateUser} from '../../store/authSlice';

const ConfirmEmail = () => {
  const { emailToken } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state?.auth?.value?.user);

  const [error, setError] = useState(false);

  useEffect(() => {
    /*if (!user) {
      navigate('/auth/login', {
        state: {
          redirect: location.pathname,
        },
      });
      return;
    } else */if (user?.confirmed) {
      if (user.wallet)
        navigate('/wallet');
      else
        navigate('/dashboard');
    }

    if (emailToken)
      setTimeout(() => {
        checkEmail();
      }, 3000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailToken, user, navigate, location]);

  const checkEmail = async () => {
    ApiAxios.post('/confirm-user', {
      emailToken: emailToken,
    })
      .then(({data: {lead, token} }) => {
        if (lead?.confirmed) {
          if (token) localStorage.setItem('token', token);
          dispatch(login({ user: lead }));

          navigate('/auth/login');
          return;
        }

        dispatch(updateUser(lead));
        dispatch(login({ user: lead }));

        navigate('/auth/create-wallet', {
          state: {
            confirmed: true,
          },
        });
      });
  };

  return (
    // <div className={'create-wallet-wrapper'}>
    //   <div style={{ width: 'auto' }} className={'create-wallet-inner'}>
    //     <div onClick={() => {}} className={'bordered-content waiting'}>
    //       <h3>{'Please wait while we confirm your email.'}</h3>
    //       <p>{error ? 'Error occured!' : 'You will be redirected automatically.'}</p>
    //       {error && <button className={'action-button'}>Go to home</button>}
    //     </div>
    //   </div>
    // </div>
    <div className='create-wallet-transition' style={{ width:'100%',height: '100vh',background:'white'}}>
      <div className='wallet-transition-header' style={{ width: '100%', height: '87px', background:'#56e9ed',paddingLeft:'347px', paddingRight: '347px',paddingTop:'30px'}}>
        <h1 style={{ fontSize: '28.86px', color: 'white', fontWeight: 600, fontFamily: 'Poppins' }}>Yootribe</h1>
      </div>
      <div className='wallet-transition-body' style={{ display:'flex', justifyContent:'center',width:'100%', height:'calc(100vh - 87px)'}}>
        <div className='wallet-transition-content' style={{ marginTop: '94px'}}>
          <h2 style={{ fontSize: '28.55px', fontWeight: 600, fontFamily: 'Poppins',letterSpacing:'-0.08rem' }}>We need to confirm you’re</h2>
          <h2 style={{ fontSize: '28.55px', fontWeight: 600, fontFamily: 'Poppins', letterSpacing: '-0.09rem',marginTop:'-7px' }}>human.</h2>
          <p style={{ fontSize: '17px', color: '#737373', fontFamily: 'Arial', fontWeight: 400, marginTop: '37px', letterSpacing: '0' }}>Thanks for helping us keep the bots away.</p>
          <p style={{ fontSize: '17px', color: '#737373', fontFamily: 'Arial', fontWeight: 400, marginTop: '20 px', letterSpacing: '0' }}>Please stand by while we are checking your browser...</p>
          <div className='wallet-transition-loader' style={{ display: 'flex', justifyContent: 'center',marginTop: '42px' }}>
            <img src={Reload} alt="svg loader" style={{ width: '43px', height: '47px', marginRight: '46px'}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;
