import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { ApiAxios } from '../../api/Api';
import { loginAuthUser, claimUserNFT } from '../../api';
import { login } from '../../store/authSlice';

const WaitingList = (props) => {
  const { setCreateWalletStep } = props;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state?.auth?.value?.user);
  const { email, id } = useParams();

  const [apiError, setApiError] = useState(null);
  const [claimError, setClaimError] = useState(null);
  const [apiFetching, setApiFetching] = useState(false);

  useEffect(() => {
    if (!id || !user) {
      return;
    }

    if (!user?.confirmed && user?.wallet) {
      return navigate('/auth/create-wallet', {
        state: {
          confirmed: true,
          redirect: location.pathname,
        },
      });
    }

    setApiFetching(true);
    setClaimError({ success: 'Checking data' });

    claimUserNFT(id)
      .then(() => {
        setClaimError({ success: 'Data is validated, your nft is ready!' });
        apiFetched();
      })
      .catch((error) => {
        apiFetched();
        setClaimError({ claim: error.error || error.message });
        console.error(error);
      });
  }, [id, user]);

  const apiFetched = () => {
    setTimeout(() => {
      setApiFetching(false);
    }, 1000);
  };

  const handleMint = (id, email) => {
    setApiFetching(true);

    ApiAxios.post('/nfts/mint', { id })
      .then(function (response) {
        toast[response.data.notification.type](response.data.notification.message, {
          autoClose: 10000,
          closeButton: false,
        });

        navigate('/wallet');
        apiFetched();
      })
      .catch(function (error) {
        console.error(error);
        apiFetched();
        setClaimError({ mint: error.response.data.error });
      });
  };

  const handleClaim = (id, email) => {
    handleMint(id);
  };

  const handleUserLogin = (e) => {
    e.preventDefault();

    loginAuthUser({ email: e.target.email.value, password: e.target.password.value })
      .then(({ user }) => {
        dispatch(login({ user }));
      })
      .catch((error) => {
        setApiError(error.message);
        console.error(error);
      });
  };

  if (!user) {
    return (
      <div className={'create-wallet-wrapper'}>
        <div style={{ alignItems: 'center' }} className={'create-wallet-inner'}>
          <h1>Hello</h1>
          <h2>
            In order to verify your identity,
            <br />
            please provide your password.
          </h2>

          <form
            onSubmit={handleUserLogin}
            className="form"
            style={{ maxWidth: '500px', width: '100%', padding: '0 80px' }}
          >
            {apiError && <div className="col-12 errors">{apiError}</div>}

            <input type="hidden" name="email" value={email} />

            <div className="form-group">
              <label htmlFor="password" style={{ color: '#fff' }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                style={{ width: '100%' }}
                autoFocus
              />
            </div>

            <button className={'action-button outlined white'} type="submit" style={{ width: '100%' }}>
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={'create-wallet-wrapper'}>
      <div style={{ width: 'auto' }} className={'create-wallet-inner'}>
        <h1 style={{ fontWeight: 'bold' }}>Hello {user?.first_name}!</h1>
        {(claimError?.claim || claimError?.mint) && (
          <div className="col-12 errors" style={{ margin: 0 }}>
            {claimError?.claim || claimError?.mint}
          </div>
        )}

        <div onClick={() => {}} className={'bordered-content waiting'}>
          {apiFetching ? (
            <div className="loading-spinner center" />
          ) : (
            <>
              {claimError?.success && <h3>{claimError?.success}</h3>}

              <button
                onClick={() => handleClaim(id, email)}
                className={'action-button'}
                disabled={claimError?.mint || claimError?.claim}
              >
                Click here to claim your NFT!
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitingList;
