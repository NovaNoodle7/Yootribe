import { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';

import { loginAuthUser, validateUserByEmail } from '../../../../api';
import { ModalContext } from '../../../../context/ModalContext';
import { login } from '../../../../store/authSlice';
import { getQuestionById } from '../../../../api/requests/Questions';
import { IntlTelInputByIp } from '../../../../components/IntlTelInputByIp';

export const RegisterWithCampaignForm = ({ campaign, onSubmit }) => {
  const dispatch = useDispatch();
  const { setContent, handleOpen, handleClose } = useContext(ModalContext);

  const [registerData, setRegisterData] = useState({});
  const [formError, setFormError] = useState({});
  const [fields, setFields] = useState([]);
  const [connectedUser, setConnectedUser] = useState({});
  const [phoneBackup, setPhoneBackup] = useState('');
  const [errorPhoneNumber,setErrorPhoneNumber] = useState('');
  const [checkCertify,setCheckCertify] = useState(false);
  const [errorCheck,setErrorCheck] = useState('');
  const [fieldToAdd, setFieldToAdd] = useState();

  if (fields.length < 1) {
    campaign?.fields?.map((item) => {
      getQuestionById(item.id)
        .then((res) => {
          res.question.required = item.required;
          setFields((prevState) => [...prevState, res.question]);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  const getFormName = (field) => (field.formName ? field.formName : field._id);

  const validateData = async (name, value, type) => {
    if (campaign?.preview) {
      return;
    }

    if (type === 'email') {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      if (!regex.test(value)) {
        setFormError({ ...formError, [name]: 'Please enter a valid email' });
      } else {
        setFormError({ ...formError, [name]: null });
      }
    }

    const campaignField = fields.find((field) => getFormName(field) === name);
    if (!value && campaignField && campaignField.required) {
      setFormError({ ...formError, [name]: 'This field is required' });
    } else {
      switch (type) {
        case 'number':
          if (value > campaignField.lengthLimit)
            setFormError({ ...formError, [name]: 'Maximum allowed is ' + campaignField.lengthLimit });
          else setFormError({ ...formError, [name]: null });
          break;

        case 'text':
        default:
          if (value.length > campaignField.lengthLimit)
            setFormError({
              ...formError,
              [name]: 'Maximum length for this field is ' + campaignField.lengthLimit + ' characters',
            });
          else setFormError({ ...formError, [name]: null });
          break;
      }
    }
  };

  const handleChange = (e, additionalFields = false) => {
    const { name, value, type } = e.target;
    const regex = /^[0-9\b]+$/;
    if (type === 'phone' && value && !regex.test(value)) {
      setFormError({ ...formError, [name]: 'Please enter a valid phone number' });
      setRegisterData({ ...registerData, [name]: phoneBackup });
      return;
    } else {
      setPhoneBackup(value);
      setErrorPhoneNumber('');
      setFormError({ ...formError, [name]: '' });
      if (additionalFields) {
        setRegisterData({ ...registerData, fields: { ...registerData.fields, [name]: value } });
        return;
      }
      validateData(name, value, type);
      setRegisterData({ ...registerData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (campaign?.preview) {
      console.error('Campaign is not live yet');
      return;
    }
    
    for (let [property, value] of Object.entries(connectedUser)) {
      registerData[property] = value;
    }
    
    if(!registerData.email){
      setFormError({ ...formError, ['email']: 'Field required' });
    }else if(! registerData.first_name){
      setFormError({ ...formError, ['first_name']: 'Field required' });

    }else if (!registerData.last_name){
      setFormError({ ...formError, ['last_name']: 'Field required' });
    }else if (!registerData.password) {
      setFormError({ ...formError, ['password']: 'Field required' });
    }else if (!registerData.username) {
      setFormError({ ...formError, ['username']: 'Field required' });
    }else if (!registerData.phone_number){
      setErrorPhoneNumber('Field required.');
    } else if (checkCertify === false) {
      setErrorCheck('Check field required');
    } else{
      setFormError({ ...formError, ['email']: '' });
      setFormError({ ...formError, ['first_name']: '' });
      setFormError({ ...formError, ['last_name']: '' });
      setFormError({ ...formError, ['password']: '' });
      setFormError({ ...formError, ['username']: '' });
      setErrorCheck('');
      setErrorPhoneNumber('');
      if (campaign?.preview) {
        console.error('Campaign is not live yet');
        return;
      }
      for (let [property, value] of Object.entries(connectedUser)) {
        registerData[property] = value;
      }
      onSubmit(registerData);
    }
  };

  const handleLoginAndAssign = async (e) => {
    e.preventDefault();

    loginAuthUser({
      email: e.target.email.value,
      password: e.target.password.value,
    })
      .then(({ user }) => {
        handleClose();

        dispatch(login({ user }));

        for (let [property, value] of Object.entries(user)) {
          if (property === '_id') {
            connectedUser['_id'] = value;
          } else {
            const elem = document.querySelector('[name=' + property + ']');

            if (elem) {
              elem.value = property === 'password' ? 'XXXXXXXXXXXXXXXXX' : value;
              elem.readOnly = true;

              connectedUser[property] = value;
            }
          }
        }
      })
      .catch((e) => {
        handleLoginModal(e.message);

        console.error(e);
      });
  };

  const handleLoginModal = (error) => {
    setContent(
      <form onSubmit={handleLoginAndAssign} className="form" style={{ width: '100%', padding: '50px 80px' }}>
        {error && <div className="col-12 errors">{error}</div>}

        <div className="form-group">
          <label htmlFor="email" style={{ color: '#fff' }}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            style={{ width: '100%' }}
            value={registerData.email}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" style={{ color: '#fff' }}>
            Password
          </label>
          <input id="password" name="password" type="password" required style={{ width: '100%' }} autoFocus />
        </div>

        <button className={'action-button outlined white'} type="submit" style={{ width: '100%' }}>
          Login
        </button>
      </form>
    );
    registerData.email = '';
    document.querySelector('[name="email"]').value = '';
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="row">
        {fields.sort((a, b) => a.order - b.order).map((field, iField) => {
          switch (field.type) {
            case 'phone':
              return (
                <div className="form-group col-md-6" key={field._id + iField}>
                  <label htmlFor={field._id}>
                    {field.question} {field.required && '*'}
                  </label>

                  <IntlTelInputByIp
                    style={{ paddingRight: 0 }}
                    onPhoneNumberChange={(isValid, number) =>
                      handleChange(
                        {
                          target: {
                            name: getFormName(field),
                            value: number,
                            type: 'phone',
                          },
                        },
                        field.categoryLabel !== 'forceRequired'
                      )
                    }
                    formatOnInit
                    placeholder=''
                    required
                    pattern="^-?[0-9]\d*\.?\d*$"
                    value={registerData.phone_number !== '' ? registerData.phone_number : ''}
                  />
                  {errorPhoneNumber !== "" ? <div className="error error-input-number">{errorPhoneNumber}</div>:''}
                </div>
              );
            case 'select':
              return (
                <div className="form-group col-md-6" key={field._id + iField}>
                  <div className={'dropdown'}>
                    <input type={'checkbox'} name={getFormName(field)} className={'dropdown__switch'} id={`filter-switch-${field._id}`} hidden />
                    <label htmlFor={`filter-switch-${field._id}`} className={'dropdown__options-filter'}>
                      <div>{field.question} {field.required && '*'}</div>
                      <ul className={'dropdown__filter w-100 large'} role={'listbox'} tabIndex={'-1'}>
                        <li className={'dropdown__filter-selected'}>
                          {fieldToAdd ? fieldToAdd : 'Please select an answer'}
                        </li>
                        <li>
                          <ul className={'dropdown__select'}>
                            {field.choices.map((option) => (
                              <li
                                key={field._id + '_' + option}
                                className={'dropdown__select-option'}
                                aria-selected={'false'}
                                role={'option'}
                                onClick={(e) => {
                                  setFieldToAdd(option);
                                  handleChange(e, field.categoryLabel !== 'forceRequired')
                                }}>
                                {option}
                              </li>
                              ))}
                          </ul>
                        </li>
                      </ul>
                    </label>
                  </div>
                  {/*
                  <label htmlFor={field._id}>
                    {field.question} {field.required && '*'}
                  </label>
                  <select
                    id={field._id}
                    name={getFormName(field)}
                    className="form-control custom-select"
                    required={field.required}
                    onChange={(e) => handleChange(e, field.categoryLabel !== 'forceRequired')}
                    onBlur={(e) => validateData(e.target.name, e.target.value, e.target.type)}
                    multiple={field.lengthLimit > 1}
                    placeholder={'Please select a value'}
                    defaultValue={''}
                  >
                    <option value="" disabled>
                      Please select an answer
                    </option>

                    {field.choices.map((option) => (
                      <option value={option} key={field._id + '_' + option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  */}
                </div>
              );
            default:
              return (
                <div className="form-group col-md-6" key={field._id + iField}>
                  <label htmlFor={field._id}>
                    {field.question} {field.required && '*'}
                  </label>
                  <input
                    min={field.question == "How many children do you have ?" ? 0 : null}
                    id={field._id}
                    name={getFormName(field)}
                    type={field.type}
                    className="form-control"
                    // required={field.required}
                    onChange={(e) => handleChange(e, field.categoryLabel !== 'forceRequired')}
                    onBlur={async (e) => {
                      if (campaign?.preview) {
                        return;
                      }

                      validateData(e.target.name, e.target.value, e.target.type);

                      if (e.target.name === 'email') {
                        const { lead, inCampaign } = await validateUserByEmail(e.target.value, campaign._id);

                        if (lead && !inCampaign) {
                          handleOpen();
                          handleLoginModal();
                        } else if (lead && inCampaign) {
                          setFormError({
                            ...formError,
                            email: 'The campaign has already been assigned to this user',
                          });
                        }
                      }
                    }}
                  />

                  {formError && formError[getFormName(field)] && 
                     formError[getFormName(field)] !== "" ? <div className="error error-input-number">{formError[getFormName(field)]}</div> : ''
                  }
                </div>
              );
          }
        })}
      </div>

      <div className="form-input-checkbox">
        <label htmlFor="accept">
          <input
            data-required="true"
            type="checkbox"
            id="accept"
            name="accept"
            className="input-control me-2"
            checked={checkCertify}
            onChange={()=>setCheckCertify(!checkCertify)}
          />
          <span>
            I certify that I am 18 years of age or older, I agree to the{' '}
            <a href="https://yootribe.io/terms" target="_blank" style={{ textDecoration: 'none' }}>
              Terms
            </a>
            , and I have read the
            <a href="https://yootribe.io/privacy" target="_blank" style={{ textDecoration: 'none' }}>
              {' '}
              Privacy Policy
            </a>
            .
          </span>
        </label>
        {errorCheck !== "" ? <div className="error error-input-number">{errorCheck}</div> : ''}
      </div>
       <button type="submit" className="btn btn-submit" disabled={campaign?.preview}>
        I want my NFT !
      </button> 
    </form>
  );
};
