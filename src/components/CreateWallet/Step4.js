import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContext } from '../../context/ToastContext';
import { ethers } from 'ethers';
import { generateMnemonic } from 'web-bip39';
import wordlist from 'web-bip39/wordlists/english';

import { CrossedEyeIcon, CopyIcon } from '../../assets/icons';
import { updateUser } from '../../store/authSlice';
import { ApiAxios } from '../../api/Api';

const Step4 = (props) => {
  const { setCreateWalletStep, phrases, setPhrases } = props;

  const user = useSelector((state) => state?.auth?.value?.user);
  const dispatch = useDispatch();
  const [blurred, setBlurred] = useState(true);
  const [address, setAddress] = useState('');
  const { handleToast } = useContext(ToastContext);

  const addWalletAddress = async () => {
    try {
      const { data } = await ApiAxios.post('/add-address', {
        id: user?._id,
        address,
      });

      dispatch(
        updateUser({
          ...user,
          ...data.model,
        })
      );

      setCreateWalletStep(5);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const wallet = ethers.Wallet.createRandom();
    // NEEDS TO ENCRYPT WALLET PRIVATE KEY AND DECRYPT
    setPhrases((wallet.mnemonic?.phrase || wallet.mnemonic).split(' '));
    setAddress(wallet.address);
    localStorage.setItem('key', wallet.privateKey);
  }, []);

  const copyHandler = () => {
    const tempPhrases = phrases.join('\n');
    navigator.clipboard.writeText(tempPhrases);
    handleToast('Successfully copied wallet phrases', 'success');
  };

  return (
    <div className={'create-wallet-inner'}>
      <div className="content-flex">
        <h1 className={'moved'}>
          I want my <span>NFT</span>
        </h1>
        <div className={'bordered-content left'}>
          <h4>Backup your wallet recovery phrase</h4>
          <p>Yootribe cannot access your secret recovery phrase. Keep it safe and never share it with anyone else.</p>
          <div className={'phrases-wrapper'}>
            <div className={`phrases ${blurred ? 'blurred' : ''}`}>
              {phrases.map((item, i) => (
                <span key={item + i} className={'single-phrase'}>
                  {item}
                </span>
              ))}
            </div>
            {blurred && (
              <button className={'reveal-button'} onClick={() => setBlurred(false)}>
                <CrossedEyeIcon />
                <span>Click here to see your catch phrase</span>
              </button>
            )}
          </div>

          {!blurred && (
            <button onClick={() => copyHandler()} className="copy-button">
              <CopyIcon />
            </button>
          )}
        </div>
      </div>
      <button onClick={() => addWalletAddress()} className={'action-button'} disabled={blurred}>
        Next
      </button>
    </div>
  );
};

export default Step4;
