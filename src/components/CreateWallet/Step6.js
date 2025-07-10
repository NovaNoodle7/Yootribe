import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { ApiAxios } from '../../api/Api';

import congratsImage from '../../assets/img/congrats-image.png';
import { updateUser } from '../../store/authSlice';

const Step6 = (props) => {
  const user = useSelector((state) => state?.auth?.value?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const finishWallet = async (e) => {
    e.preventDefault();

    if (user.confirmed) {
      navigate('/wallet');
      return;
    }

    ApiAxios.post('/confirm-user-wallet', {
      user_id: user._id,
    }).then(({ data }) => {
      dispatch(updateUser(data?.lead));

      if (location?.state?.redirect) {
        navigate(location?.state?.redirect);
        return;
      }

      navigate('/wallet', {
        state: {
          firstLogin: true,
        },
      });
    });
  };

  return (
    <div className={'create-wallet-inner'}>
      <div className={'bordered-content'}>
        <div style={{ flexDirection: 'column' }} className={'inner'}>
          <img src={congratsImage} alt={'congrats'} />
          <h3>{user?.first_name}</h3>
          <p className={'welcome'}>
            Welcome to Web3 world, <br />
            your Yootribe wallet is <span>ready to go!</span>
          </p>
        </div>
        <button onClick={finishWallet} className={'end-button'}>
          Give it to me
        </button>
      </div>
    </div>
  );
};

export default Step6;
