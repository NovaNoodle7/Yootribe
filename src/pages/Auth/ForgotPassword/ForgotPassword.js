import React, { useState } from 'react';
import { userResetPassword, userSendOtpRequest } from '../../../api';
import PasswordChecklist from 'react-password-checklist';
import brandLogo from '../../../assets/img/logo-yootribe.png';
import nextIcon from '../../../assets/img/next-icon.png';
import connectionIcon from '../../../assets/img/connection-icon.png';

export const ForgotPassword = ({ show, closeModal, email }) => {
  const [otpCode, setOtpCode] = useState([0, 0, 0, 0, 0, 0]);
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [disabledButton, setDisableButton] = useState(true);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  const [formError, setFormError] = useState(null);

  const onInputPaste = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const getPasteData = e.clipboardData;
    const toArray = Array.from(getPasteData.getData('text/plain'));

    setOtpCode(toArray);
  };

  const onOtpChange = (e, index) => {
    const values = [...otpCode];
    values[index] = e.target.value;

    setOtpCode(values);
  };

  const onOtpNext = (e) => {
    e.preventDefault();

    userSendOtpRequest({
      email,
      otp: otpCode.join('')
    })
      .then(() => {
        setShowResetPasswordForm(true);
      })
      .catch((error) => {
        setFormError(error.message);
      });
  };
  
  const onResetPassword = () => {
    userResetPassword({
      email: email,
      otp: otpCode.join(''),
      password
    })
      .then(() => {
        setOtpCode([0, 0, 0, 0, 0, 0]);
        setShowResetPasswordForm(false);
        closeModal();
      })
      .catch((error) => {
        setFormError(error.message);
      });
  };

  return (
    <div
      className="forgot-password-modal"
      style={{
        ...(show && {
          transform: 'translateX(0%)',
        }),
      }}
    >
      <div className="forgot-password-header">
        <a className="navbar-brand" href="/">
          <img src={brandLogo} alt="" />
        </a>
        <a className="go-back-button" href={'#connect'} onClick={closeModal}>
          <img src={connectionIcon} alt="" /> Connection
        </a>
      </div>

      {!showResetPasswordForm && (
        <div className="forgot-password-content">
          <h3>Reset your password</h3>
          <p>Enter the verification code recieved on your email</p>

          {formError && <p className="errors">{formError}</p>}

          <form className="forgot-input-form" onSubmit={onOtpNext}>
            <input
              className="otp-input"
              id="n1"
              type="text"
              placeholder="0"
              maxLength={1}
              autoFocus
              data-next="n2"
              onPaste={onInputPaste}
              value={otpCode[0]}
              onChange={(e) => onOtpChange(e, 0)}
            />
            <input
              className="otp-input"
              id="n2"
              type="text"
              placeholder="0"
              maxLength={1}
              autoFocus
              data-previous="n1"
              data-next="n3"
              onPaste={onInputPaste}
              value={otpCode[1]}
              onChange={(e) => onOtpChange(e, 1)}
            />
            <input
              className="otp-input"
              id="n3"
              type="text"
              placeholder="0"
              maxLength={1}
              autoFocus
              data-previous="n2"
              data-next="n4"
              onPaste={onInputPaste}
              value={otpCode[2]}
              onChange={(e) => onOtpChange(e, 2)}
            />
            <input
              className="otp-input"
              id="n4"
              type="text"
              placeholder="0"
              maxLength={1}
              autoFocus
              data-previous="n3"
              data-next="n5"
              onPaste={onInputPaste}
              value={otpCode[3]}
              onChange={(e) => onOtpChange(e, 3)}
            />
            <input
              className="otp-input"
              id="n5"
              type="text"
              placeholder="0"
              maxLength={1}
              autoFocus
              data-previous="n4"
              data-next="n6"
              onPaste={onInputPaste}
              value={otpCode[4]}
              onChange={(e) => onOtpChange(e, 4)}
            />
            <input
              className="otp-input"
              id="n6"
              type="text"
              placeholder="0"
              maxLength={1}
              autoFocus
              data-previous="n5"
              onPaste={onInputPaste}
              value={otpCode[5]}
              onChange={(e) => onOtpChange(e, 5)}
            />
            <button className="navbar-brand next-forgot" type="submit">
              {/* TODO insert next-icon.png */}
              <img src={nextIcon} alt="" />
            </button>
          </form>
          <a className="resend-otp" href="#reset-otp">
            I did not recieve anything, resend me the code
          </a>
          <div className="security-notice">
            <p>
              The security of your personal information is essential. <br />
              We therefore verfiy that you are indeed ad the origin of this request.
            </p>
          </div>
        </div>
      )}

      {showResetPasswordForm && (
        <div className="new-password-form" style={{ display: 'flex' }}>
          <h3>Please enter your new password.</h3>
          <form className="forgot-form" onSubmit={onResetPassword}>
            <input
              id="new-pass"
              className="form-control"
              type="password"
              placeholder="New password"
              required
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={false}
            />
            <input
              id="confirm-new-pass"
              className="form-control"
              type="password"
              placeholder="Confirm new password"
              autoComplete={false}
              onChange={(e) => setPasswordAgain(e.target.value)}
            />
            {formError && <p className="errors">{formError}</p>}

            <p>
              New password must contain:
            </p>
            <PasswordChecklist
              rules={['minLength', 'specialChar', 'number', 'capital', 'match']}
              minLength={8}
              value={password}
              valueAgain={passwordAgain}
              onChange={(isValid) => setDisableButton(!isValid)}
              iconSize={12}
              style={{ alignSelf: 'flex-start' }}
              className={'password-checker'}
            />
            <button disabled={disabledButton} className="btn btn-light" type="submit">
              Validate
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
