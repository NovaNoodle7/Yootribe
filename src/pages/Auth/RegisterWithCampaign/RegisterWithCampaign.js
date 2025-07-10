import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { getCampaignBySlug, loginAuthUser, loginLeadAndAssignCampaign, registerNewCampaignUser } from '../../../api';
import { ModalContext } from '../../../context/ModalContext';
import { login } from '../../../store/authSlice';
import { RegisterWithCampaignForm } from './components/Form';
import { Header } from './components/Header';
import { ReportScamModalContent } from './components/ReportScamModal';

import DraftIcon from '../../../assets/icons/icon-draft.png';
import { FlagIcon } from '../../../assets/icons';

import '../bootstrap.min.css';
import '../style.css';

export const RegisterWithCampaign = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setContent, handleOpen, handleClose } = React.useContext(ModalContext);
  const user = useSelector((state) => state.auth?.value?.user);

  const [campaign, setCampaign] = React.useState({});
  const [apiError, setApiError] = React.useState(null);
  const [formSuccess, setFormSuccess] = React.useState(false);

  const loginRequired = campaign?.status?.toLowerCase() === 'draft' && (!user || user._id !== campaign.user_id);

  React.useEffect(() => {
    getCampaignBySlug(slug?.toLocaleLowerCase())
      .then((res) => setCampaign(res?.data))
      .catch((err) => {
        console.error(err);
        navigate('/auth/login');
      });
  }, [slug, navigate]);

  const handleSubmit = (data) => {
    const allData = { campaign_id: campaign._id, ...data };

    const formData = new FormData();
    Object.keys(allData).forEach((key) => {
      if (key === 'fields') {
        formData.append(key, JSON.stringify(allData[key]));
        return;
      }

      formData.append(key, allData[key]);
    });

    if (formData.has('_id')) {
      loginLeadAndAssignCampaign(formData)
        .then(() => {
          // navigate('/wallet');
          setFormSuccess(true);
        })
        .catch((error) => {
          setApiError(error.message);
        });
    } else {
      registerNewCampaignUser(formData)
        .then(({ lead, token }) => {
          localStorage.setItem('token', token);
          dispatch(login({ user: lead }));

          setFormSuccess(true);
        })
        .catch((error) => {
          setApiError(error.message);
        });
    }
  };

  const handleReportModal = () => {
    handleOpen();
    setContent(<ReportScamModalContent campaign_id={campaign._id} closeModal={handleClose} />);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();

    loginAuthUser({
      email: e.target.email.value,
      password: e.target.password.value,
    })
      .then(({ user }) => {
        if (user._id !== campaign.user_id) {
          setApiError('Only owner of this campaign can be logged in, please try again.');
          return;
        }

        dispatch(login({ user }));
        setApiError(null);
      })
      .catch((error) => {
        setApiError(error.message);
        console.error(error);
      });
  };

  return (
    <div
      className={
        formSuccess === false
          ? campaign?.status?.toLowerCase() !== 'ended'
            ? 'register-compaign-content'
            : 'register-compaign-content-thanks'
          : 'register-compaign-content-thanks'
      }
    >
      <div className="register-with-campaign">
        {campaign?.status?.toLowerCase() !== 'ended'
          ? campaign?.preview && (
              <div className="campaign-preview-bar">
                <img src={DraftIcon} alt="Draft icon" width="12" height="12" /> This is a draft version mode
              </div>
            )
          : ''}

        <Header campaign={campaign} />

        {loginRequired ? (
          <div className="container">
            <form onSubmit={handleAdminLogin} className="form" style={{ width: '100%', padding: '50px 80px' }}>
              {apiError && <div className="col-12 errors">{apiError}</div>}

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required style={{ width: '100%' }} />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" required style={{ width: '100%' }} autoFocus />
              </div>

              <button className="btn btn-submit" type="submit">
                Login
              </button>
            </form>
          </div>
        ) : (
          <>
            {campaign?.status?.toLowerCase() !== 'ended' && !formSuccess && (
              <>
                <p className="campaign-content" style={{ textAlign: 'right' }}>
                  * All fields are mandatory
                </p>

                <p className="campaign-content" dangerouslySetInnerHTML={{ __html: campaign.content }} />
              </>
            )}

            <div className="container">
              {apiError && <div class="errors">{apiError}</div>}
              {campaign?.status?.toLowerCase() !== 'ended' ? (
                <>
                  {formSuccess ? (
                    <div className="campaign-ended-content">
                      <h2 className="mb-4">Thanks for signing up!</h2>
                      <p>
                        Remember to create your wallet using the link provided in your
                        <br /> email so that you can claim your NFT once the campaign ends.
                      </p>
                    </div>
                  ) : (
                    <>
                      <RegisterWithCampaignForm campaign={campaign} onSubmit={handleSubmit} />
                      <button className="report-scam" onClick={handleReportModal}>
                        <FlagIcon />
                        Report As Scam/Fraud
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="campaign-ended-content">
                  <h2>The campaign has come to an end</h2>
                  <p className="mt-3">
                    Thank you to all participants, please make sure
                    <br /> to check for email so you can claim your nft.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
