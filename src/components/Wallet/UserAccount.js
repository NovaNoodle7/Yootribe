import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { updateWallet } from '../../api';
import { getKeywordById } from '../../api';
import { KeywordsInput } from "../micro/FormComponents";

const UserAccount = () => {
  const userData = useSelector((state) => state.auth.value.user);

  const avatarInputRef = React.createRef();

  const [singleUser, setSingleUser] = useState({});
  const [keywords, setKeywords] = useState([]);
  const [formErrors, setFormErrors] = useState([]);
  const [formResult, setFormResult] = useState('');

  useEffect(() => {

    if (localStorage.getItem("singleUser")){
      const savedSingleUser = JSON.parse(localStorage.getItem("singleUser"));
      setSingleUser({
        email: savedSingleUser.email,
        avatar: savedSingleUser.avatar,
        first_name: savedSingleUser.first_name,
        last_name: savedSingleUser.last_name,
        username: savedSingleUser.username,
        email_opt_in: savedSingleUser.email_opt_in,
        commercial_opt_in: savedSingleUser.commercial_opt_in,
      });
    }else{
      setSingleUser({
        email: userData.email,
        avatar: userData.avatar,
        first_name: userData.first_name,
        last_name: userData.last_name,
        username: userData.username,
        email_opt_in: userData.email_opt_in,
        commercial_opt_in: userData.commercial_opt_in,
      });
    }



    if (localStorage.getItem("keywords")) {
      const saved = localStorage.getItem("keywords");
      setKeywords(JSON.parse(saved));
    } else {
      for (let id of userData.keyword_ids) {
        getKeywordById(id)
          .then((res) => {
            setKeywords((prevState) => [...prevState, res.keyword.word]);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }


  }, [userData]);


  const changeHandler = (e) => {
    setFormResult('');
    setSingleUser({
      ...singleUser,
      [e.target.name]: e.target.value
        .replaceAll(/[^a-z]/ig, '')
        .substring(0, 15)
    });
  };
  const checkboxChangeHandler = (e) => {
    setFormResult('');
    setSingleUser({ ...singleUser, [e.target.name]: e.target.checked });
  };

  const avatarUploadHandler = (e) => {
    setSingleUser({ ...singleUser, avatar: e.target.files[0] });
  };

  const saveChanges = async () => {
    const formData = new FormData();
    Object.keys(singleUser).forEach((key) => {
      formData.append(key, singleUser[key]);
    });
    localStorage.setItem("singleUser", JSON.stringify(singleUser));
    formData.append('keywords', keywords);
    localStorage.setItem("keywords", JSON.stringify(keywords));

    updateWallet(formData)
      .then(() => {
        setFormErrors([]);
        setFormResult('OK');
        // todo save changes in client side
        // dispatch(updateUser({ user: singleUser }));
      })
      .catch((error) => {
        setFormErrors(['username']);
        setFormResult('KO');
      });
  };

  return (
    <div className={'user-account-wallet'}>
      <span className={'required-fields'}>* Required fields</span>
      <div className={'edit-account-wrapper'}>
        <h3>Edit account</h3>
        {formResult === 'OK' && (
          <div className="col-12 errors bg-success text-white">All changes are saved</div>
        )}
        {formResult === 'KO' && (
          <div className="col-12 errors">Changes are not saved due to errors</div>
        )}

        <div className={'inputs-two-cells'}>
          <div className={'input-wrapper'}>
            <label id={'email-label'}>{'Email'}</label>
            <text id={'email'} name={'email'}>
              {singleUser.email}
            </text>
          </div>
        </div>
        <div className={'inputs-two-cells'}>
          <div className={'input-wrapper'}>
            <label htmlFor={'first_name'}>
              {'First Name'}
              <span className="required-indicator">*</span>
            </label>
            <input
              value={singleUser.first_name}
              onChange={changeHandler}
              type={'text'}
              id={'first_name'}
              name={'first_name'}
            />
          </div>
          <div className={'input-wrapper'}>
            <label htmlFor={'last_name'}>
              {'Last Name'}
              <span className="required-indicator">*</span>
            </label>
            <input
              value={singleUser.last_name}
              onChange={changeHandler}
              type={'text'}
              id={'last_name'}
              name={'last_name'}
            />
          </div>
        </div>
        <div className={'inputs-two-cells'}>
          <div className={'input-wrapper'}>
            <label htmlFor={'username'}>
              {'Username'}
              <span className="required-indicator">*</span>
            </label>
            {formErrors.includes('username') && (
              <p className={'general-error'}>Username is already used by an other user</p>
            )}
            <input
              value={singleUser.username}
              onChange={changeHandler}
              type={'text'}
              id={'username'}
              name={'username'}
            />
          </div>
          <div className={'input-wrapper'}>
            <label htmlFor={'keywords'}>{'Interest Keywords'}</label>
            <KeywordsInput state={keywords} setState={setKeywords} />
          </div>
        </div>
        <div className={'w-100'}>
          <input
            ref={avatarInputRef}
            accept="image/.png,.jpeg,.jpg"
            type="file"
            id="avatar-input-field"
            hidden
            onChange={avatarUploadHandler}
          />
          <button
            type="button"
            id="avatar-input-button"
            onClick={(e) => {
              e.preventDefault();
              avatarInputRef.current.click();
            }}
            style={{
              margin: '0',
              width: '100%',
              backgroundColor: '#369eb2',
              borderColor: '#369eb2'
            }}
            className="btn btn-primary btn-custom">
            Upload avatar
          </button>
        </div>
        <div className={'checkbox-wrapper-one-cell'}>
          <div className={'checkbox-wrapper'}>
            <input
              id={'email_opt_in'}
              type={'checkbox'}
              name={'email_opt_in'}
              checked={singleUser.email_opt_in}
              onChange={checkboxChangeHandler}
            />
            <label htmlFor={'email_opt_in'}>
              {
                'I agree to receive activity emails from this Yootribe. I can revoke this conset anytime. (opt-in)'
              }
            </label>
          </div>
          <div className={'checkbox-wrapper'}>
            <input
              id={'commercial_opt_in'}
              type={'checkbox'}
              name={'commercial_opt_in'}
              checked={singleUser.commercial_opt_in}
              onChange={checkboxChangeHandler}
            />
            <label htmlFor={'commercial_opt_in'}>
              {
                'I agree to receive commercial emails from this Yootribe. I can revoke this consent at any time by unsubscribing to any commercial email from this Host. (opt-in)'
              }
            </label>
          </div>
        </div>
        <div className={'action-buttons'}>
          <button className={'action-button'} onClick={saveChanges}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
