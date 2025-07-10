import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Step1 from '../../components/CreateWallet/Step1';
import Step2 from '../../components/CreateWallet/Step2';
import Step3 from '../../components/CreateWallet/Step3';
import Step4 from '../../components/CreateWallet/Step4';
import Step5 from '../../components/CreateWallet/Step5';
import Step6 from '../../components/CreateWallet/Step6';

import yootribeLogo from '../../assets/img/logo-yootribe.png';
import { useSelector } from 'react-redux';

const CreateWallet = () => {
  const user = useSelector((state) => state?.auth?.value?.user);
  const navigate = useNavigate();

  const [createWalletStep, setCreateWalletStep] = useState(1);
  const [phrases, setPhrases] = useState([]);
  const { state } = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }

    if (user && user?.confirmed) {
      navigate('/wallet');
    }

    if (state?.confirmed && createWalletStep < 2) {
      setCreateWalletStep(2);
    }
  }, [state, createWalletStep, navigate]);

  return (
    <div className={'create-wallet-wrapper'}>
      <div className={'create-wallet-header'}>
        <img src={yootribeLogo} alt={'Yootribe'} />
      </div>
      {createWalletStep === 1 && <Step1 setCreateWalletStep={setCreateWalletStep} />}
      {createWalletStep === 2 && <Step2 setCreateWalletStep={setCreateWalletStep} />}
      {createWalletStep === 3 && <Step3 setCreateWalletStep={setCreateWalletStep} />}
      {createWalletStep === 4 && (
        <Step4 setCreateWalletStep={setCreateWalletStep} phrases={phrases} setPhrases={setPhrases} />
      )}
      {createWalletStep === 5 && <Step5 setCreateWalletStep={setCreateWalletStep} phrases={phrases} />}
      {createWalletStep === 6 && <Step6 setCreateWalletStep={setCreateWalletStep} />}
    </div>
  );
};

export default CreateWallet;
