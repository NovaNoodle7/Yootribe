import React, { useState, useContext, useEffect, useRef } from 'react';
import { ToastContext } from '../../context/ToastContext';

const Step5 = (props) => {
  const { setCreateWalletStep, phrases } = props;
  const { handleToast } = useContext(ToastContext);
  const [validation, setValidation] = useState([]);
  const [useValidate, setUseValidate] = useState([]);
  const buttonRef = useRef({});
  const validateRef = useRef(null);

  const handleValidation = (phrase, i) => {
    if (validation.includes(phrase)) {
      if (buttonRef.current[i].classList.contains('good')) {
        setUseValidate(useValidate.filter((item) => item !== phrase));
        buttonRef.current[i].className = 'single-phrase';
      } else {
        setUseValidate([...useValidate, phrase]);
        buttonRef.current[i].className = 'single-phrase good';
      }
    } else {
      if (buttonRef.current[i].classList.contains('bad')) {
        setUseValidate(useValidate.filter((item) => item !== phrase));
        buttonRef.current[i].className = 'single-phrase';
      } else {
        setUseValidate([...useValidate, phrase]);
        buttonRef.current[i].className = 'single-phrase bad';
      }
    }
  };

  useEffect(() => {
    const checkPhrases = phrases.filter((item, i) => i === 0 || i === 1 || i === 8);
    setValidation(checkPhrases);
  }, [phrases]);

  useEffect(() => {
    if (validation.every((item) => useValidate.indexOf(item) > -1) && useValidate.length === 3)
      validateRef.current.removeAttribute('disabled');
    else validateRef.current.setAttribute('disabled', true);
  }, [useValidate, validation]);

  const handleNextStep = () => {
    handleToast('Successfully validated', 'success');
    setCreateWalletStep(6);
  };

  return (
    <div className={'create-wallet-inner'}>
      <div className="content-flex">
        <h1 className={'moved'}>
          I want my <span>NFT</span>
        </h1>
        <div className={'bordered-content left'}>
          <h4>Check your recovery phrase</h4>
          <p>
            Click on the First (1st), Second (2nd), and Ninth (9th) words of your recovery phrase.
          </p>
          <div className={'phrases-wrapper'}>
            <div className={`phrases`}>
              {phrases.map((item, i) => (
                <button
                  onClick={() => handleValidation(item, i)}
                  key={item + i}
                  ref={(ref) => (buttonRef.current[i] = ref)}
                  className={`single-phrase`}>
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <button onClick={() => handleNextStep()} className={'action-button'} ref={validateRef}>
        Validate
      </button>
    </div>
  );
};

export default Step5;
