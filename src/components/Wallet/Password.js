import React, { useState } from 'react';
import PasswordChecklist from 'react-password-checklist';
import { useSelector } from 'react-redux';

import { updatePassword } from '../../api';
import { EyeIcon, CrossedEyeIcon } from '../../assets/icons';

const UserPassword = () => {
  const [currentPass, setCurrentPass] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [disabledButton, setDisableButton] = useState(true);
  const [formErrors, setFormErrors] = useState([]);
  const [formResult, setFormResult] = useState('');

  const { _id } = useSelector((state) => state?.auth?.value?.user);

  const [showPasswords, setShowPasswords] = useState({
    current_pass: false,
    new_password: false,
    confirm_password: false
  });

  const passwordShowHandler = (type) => {
    setShowPasswords({
      ...showPasswords,
      [type]: !showPasswords[type]
    });
  };

  const saveChanges = async () => {
    if (!disabledButton) {
      const formData = new FormData();
      formData.append('user_id', _id);
      formData.append('current_pass', currentPass);
      formData.append('new_password', password);

      updatePassword(formData)
        .then(() => {
          setFormErrors([]);
          setFormResult('OK');

          setCurrentPass('')
          setPassword('')
          setPasswordAgain('')
        })
        .catch((error) => {
          setFormErrors(['current_pass']);
          setFormResult('KO');
        });
    }
  };

  return (
    <div className={'user-account-wallet'}>
      <span className={'required-fields'}>* Required fields</span>
      <div className={'edit-password-wrapper'}>
        <h3>Edit Password</h3>
        {formResult === 'OK' && (
          <div className="col-12 errors bg-success text-white">
            Your password has been updated successfully
          </div>
        )}
        {formResult === 'KO' && (
          <div className="col-12 errors">Changes are not saved due to errors</div>
        )}

        <div className={'input-one-cell'}>
          <div className={'input-wrapper'}>
            <label htmlFor={'current_pass'}>
              {'Current Password'}
              <span className="required-indicator">*</span>
            </label>
            {formErrors.includes('current_pass') && (
              <p className={'general-error'}>Current password is incorrect</p>
            )}
            <div className={'input-with-eye'}>
              <input
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                type={showPasswords.current_pass ? 'text' : 'password'}
                id={'current_pass'}
                name={'v'}
              />
              {showPasswords.current_pass ? (
                <CrossedEyeIcon onClick={() => passwordShowHandler('current_pass')} />
              ) : (
                <EyeIcon onClick={() => passwordShowHandler('current_pass')} />
              )}
            </div>
          </div>
        </div>
        <div className={'input-one-cell'}>
          <div className={'input-wrapper'}>
            <label htmlFor={'new_password'}>
              {'New Password'}
              <span className="required-indicator">*</span>
            </label>
            <div className={'input-with-eye'}>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPasswords.new_password ? 'text' : 'password'}
                id={'new_password'}
                name={'new_password'}
              />
              {showPasswords.new_password ? (
                <CrossedEyeIcon onClick={() => passwordShowHandler('new_password')} />
              ) : (
                <EyeIcon onClick={() => passwordShowHandler('new_password')} />
              )}
            </div>
          </div>
        </div>
        <div className={'input-one-cell'}>
          <div className={'input-wrapper'}>
            <label htmlFor={'confirm_password'}>
              {'Confirm new password'}
              <span className="required-indicator">*</span>
            </label>
            <div className={'input-with-eye'}>
              <input
                value={passwordAgain}
                onChange={(e) => setPasswordAgain(e.target.value)}
                type={showPasswords.confirm_password ? 'text' : 'password'}
                id={'confirm_password'}
                name={'confirm_password'}
              />
              {showPasswords.confirm_password ? (
                <CrossedEyeIcon onClick={() => passwordShowHandler('confirm_password')} />
              ) : (
                <EyeIcon onClick={() => passwordShowHandler('confirm_password')} />
              )}
            </div>
          </div>
        </div>
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
        <div className={'action-buttons'}>
          <button disabled={disabledButton} className={'action-button'} onClick={saveChanges}>
            Validate
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPassword;
