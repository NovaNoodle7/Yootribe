import React, {useContext, useState} from 'react';
import { useSelector } from 'react-redux';
import { ApiAxios } from '../../api/Api';

import { ModalContext } from '../../context/ModalContext';

const ValidatePasswordModal = ({ nextStep }) => {
  const { _id } = useSelector((state) => state?.auth?.value?.user);

  const [password, setPassword] = React.useState(null);
  const [formResult, setFormResult] = useState('');

  const onUserValidation = async () => {
    const { data } = await ApiAxios.post('/validate-user-password', {
      user_id: _id,
      password
    });

    if (data?.isValid) {
      setFormResult('');
      nextStep();
    } else {
      setFormResult('KO');
    }
  };

  return (
    <>
      <div className={'modal-body-main'}>
        <h2>Confirm your password</h2>

        {formResult === 'KO' && (
          <p className={'general-error'} style={{display: "block"}}>Password is incorrect</p>
        )}

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          id={'confirm_password'}
          placeholder="Enter your password"
          name={'password'}
          style={{
            width: '50%',
            height: '40px',
            margin: '20px 0'
          }}
        />
      </div>
      <div className={'modal-footer-main'}>
        <button
          className={'action-button outlined white'}
          disabled={!password}
          onClick={onUserValidation}>
          Validate Password
        </button>
      </div>
    </>
  );
};

const ExportWalletModal = () => {
  const userData = useSelector((state) => state?.auth?.value?.user);

  return (
    <>
      <div className={'modal-body-main'}>
        <h2>Wallet Exported</h2>

        <textarea className="textarea-clipboard" readOnly rows={7} cols={50}>
          {userData?.wallet_private_key}
        </textarea>
      </div>
      <div className={'modal-footer-main'}>
        <button
          className={'action-button outlined white'}
          onClick={() => {
            navigator.clipboard.writeText(userData.wallet_private_key);
          }}>
          Copy to clipboard
        </button>
        <button
          className={'action-button outlined white'}
          onClick={() => {
            const dataStr =
              'data:text/json;charset=utf-8,' +
              encodeURIComponent(
                JSON.stringify({
                  private_key: userData.wallet_private_key
                })
              );

            const aTag = document.createElement('a');
            aTag.setAttribute('href', dataStr);
            aTag.setAttribute('download', `${userData?.first_name}-wallet.json`);

            document.body.appendChild(aTag);
            aTag.click();
            aTag.remove();
          }}>
          Download as file
        </button>
      </div>
    </>
  );
};

const ExportWallet = () => {
  const { setContent, handleOpen } = useContext(ModalContext);

  const handleUserValidation = () => {
    handleOpen();
    setContent(<ValidatePasswordModal nextStep={handleExportWallet} />);
  };

  const handleExportWallet = () => {
    setContent(<ExportWalletModal />);
  };

  return (
    <div className={'user-account-wallet'}>
      <div
        className={'edit-account-wrapper'}
        style={{ minHeight: 'unset', alignItems: 'start', gap: '20px' }}>
        <h3>Export Wallet</h3>

        <h4>Warning: Never disclose this file.</h4>

        <p>Anyone with your private file can steal any assets held in this wallet.</p>

        <p>
          By exporting your wallet you confirm to understand the related security risks and accept
          that Yootribe can not be held liable for any loss of funds.
        </p>

        <div className={'action-buttons'} style={{ marginTop: '15%', alignSelf: 'center' }}>
          <button onClick={handleUserValidation} className="action-button outlined">
            Export Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportWallet;
