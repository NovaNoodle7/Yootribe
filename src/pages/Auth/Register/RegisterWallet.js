import React from 'react';
import { useDispatch } from 'react-redux';
import { registerWallet } from '../../../api';
import { IntlTelInputByIp } from '../../../components/IntlTelInputByIp';
import { login } from '../../../store/authSlice';
import { Web3Button } from '@web3modal/react'





import '../bootstrap.min.css';
import '../style.css';


import LogoYoutribe from '../../../assets/img/img_footer/logo-yootribe.png';
import LogoFooterYoutribe from '../../../assets/img/img_footer/logo-footer-yootribe.jpg';

export const RegisterWallet = () => {
  const dispatch = useDispatch();

  const avatarInputRef = React.createRef();
  const [registerData, setRegisterData] = React.useState({});
  const [formError, setFormError] = React.useState(null);
  const [avatarError, setAvatarError] = React.useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const regex = /^[0-9\b]+$/;
    if (name === 'phone_number' && value && !regex.test(value)) {
      setFormError('Please enter a valid phone number');
      return;
    } else {
      setFormError(null);
    }

    if (name === 'confirm_password') {
      if (registerData.password !== value) {
        setFormError('Passwords must match!');
      } else {
        setFormError(null);
      }
    }

    setRegisterData({ ...registerData, [name]: value });
  };

  const handleAvatarUpload = (e) => {
    const extension = e.currentTarget.files[0].name.split('.').pop();
    if(extension === "png" || extension === "jpeg" || extension === "jpg"){
      setAvatarError('');
      setRegisterData({ ...registerData, avatar: e.target.files[0] });
    }
    else{
      setAvatarError('Uploading this file is not allowed')
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(registerData).forEach((key) => {
      if (key === 'confirm_password') {
        return;
      }
      formData.append(key, registerData[key]);
    });

    registerWallet(formData)
      .then(({ lead }) => {
        dispatch(login({ user: lead }));
        window.location.replace('https://yootribe.io/thankyou-user');
      })
      .catch((error) => {
        setFormError(error.message);
      });
  };

  return (
    <div className="register-page user-bg">
      <main className="main">
        <div className="main_form" style={{ height: 'calc(100vh - 106px)' }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="register-sec user-reg">
                  <h3>Sign up with for NFT</h3>
                  <Web3Button/>
                  <p>
                    Take part in this adventure on a collaborative journey
                  </p>
                  <form className="form registration-form" onSubmit={onSubmit}>
                    {formError && <div className="col-12 errors">{formError}</div>}
                    <div className="row">
                      <div className="form-group col-md-6">
                        <input
                          name="first_name"
                          id="first_name"
                          type="text"
                          className="form-control"
                          placeholder="First name"
                          required
                          onKeyDown={(e) => /^([^0-9]*)$/i.test(e.key)}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <input
                          name="last_name"
                          id="last_name"
                          type="text"
                          className="form-control"
                          placeholder="Last name"
                          required
                          onKeyDown={(e) => /^([^0-9]*)$/i.test(e.key)}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-md-6">
                        <input
                          name="username"
                          id="username"
                          type="text"
                          className="form-control"
                          placeholder="User name"
                          required
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-md-6">
                        <input
                          name="birthday"
                          id="birthday"
                          type="date"
                          placeholder="dd-mm-yyyy"
                          className="form-control"
                          required
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-md-6">
                        <input
                          name="email"
                          id="email"
                          type="email"
                          className="form-control"
                          placeholder="Email address"
                          required
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <IntlTelInputByIp
                          style={{ paddingRight: 0 }}
                          onPhoneNumberChange={(isValid, number) =>
                            handleChange({ target: { name: 'phone_number', value: number } })
                          }
                          value={registerData.phone_number}
                          placeholder={'Phone number'}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div style={{ marginBottom: '20px' }} className="form-group col-md-6">
                        <div className="password-eye">
                          <input
                            name="password"
                            id="password"
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            required
                            pattern="^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$"
                            onInvalid={e => e.target.setCustomValidity('Password must contain at least one number and one uppercase and lowercase letter and special character, and at least 8 or more characters')}
                            onInput={e => e.target.setCustomValidity('')}
                            onChange={handleChange}
                          />
                          <span
                            toggle="#password"
                            className="fa fa-fw fa-eye field-icon toggle-password show-password"
                          ></span>
                        </div>
                      </div>
                      <div style={{ marginBottom: '20px' }} className="form-group col-md-6">
                        <div className="password-eye">
                          <input
                            name="confirm_password"
                            id="confirm_password"
                            type="password"
                            className="form-control"
                            placeholder="Confirm Password"
                            required
                            onInvalid={e => e.target.setCustomValidity('Passwords must match!')}
                            onInput={e => e.target.setCustomValidity('')}
                            pattern="^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$"
                            onChange={handleChange}
                          />
                          <span
                            toggle="#confirm_password"
                            className="fa fa-fw fa-eye field-icon toggle-password show-password"
                          ></span>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <p
                          style={{
                            color: '#fff',
                            marginBottom: '20px',
                            fontSize: '11px',
                            textAlign: 'left',
                          }}
                        >
                          Password must contain at least one number and one uppercase and lowercase letter and special
                          character, and at least 8 or more characters
                        </p>
                      </div>
                      <div className="form-group col-md-12">
                        <input
                          ref={avatarInputRef}
                          accept="image/.png,.jpeg,.jpg"
                          type="file"
                          id="avatar-input-field"
                          hidden
                          onChange={handleAvatarUpload}
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
                            borderColor: '#369eb2',
                          }}
                          className="btn btn-primary btn-custom"
                        >
                          Add avatar
                        </button>
                        <br/>
                        <button
                          type="button"
                          id="avatar-input-button"
                          onClick={(e) => {

                          }}
                          style={{
                            margin: '0',
                            width: '100%',
                            backgroundColor: '#369eb2',
                            borderColor: '#369eb2',
                          }}
                          className="btn btn-primary btn-custom"
                        >
                          Connect Wallet
                        </button>
                       

                        {avatarError ? <p className={'error'}>{avatarError}</p> : null}
                      </div>
                    </div>
                    <div className="col-12 mb-0">
                      <span className="error"></span>
                    </div>

                    <div className="col-12 mb-0">
                      <div style={{ paddingLeft: '0.5rem', display:'flex' }} className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="terms_conditions"
                          name="terms_conditions"
                          required
                          onInvalid={e => e.target.setCustomValidity('Please confirm that you are 18 years or older!')}
                          onInput={e => e.target.setCustomValidity('')}
                          style={{ marginTop:'-11px',marginRight:'10px' }}
                        />
                        <label className="label custom-control-label form-check-label" htmlFor="terms_conditions">
                          I certify that I am 18 years of age or older, I agree to the
                          <a style={{ color: '#ea8f0c',marginLeft:'3px' }} target="_blank" href="https://yootribe.io/terms">
                            Terms
                          </a>
                          , and I have read the
                          <a style={{ color: '#ea8f0c',marginLeft:'3px' }} target="_blank" href="https://yootribe.io/privacy">
                            Privacy Policy
                          </a>
                          .
                        </label>
                      </div>
                    </div>
                    <div className="form-group row_center">
                      <button type="submit" id="submit" className="btn btn-primary submit-button btn-custom">
                        Validate
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        {/* <footer style={{ display: 'flex', alignItems: 'center', color: "grey", fontWeight: 600, height: '40px' }}  >
        <span>&copy; 2022 Yootribe, SAS, All Rights Reserved</span>
      </footer> */}


         {/* footer */}
        <div class="footer-login">
          <div class="bottomFooter">
            <div class="container-footer">
              <ul class="list">


                <li class="item first">
                  <a class="navbar-brand" href="/"><img src={LogoYoutribe} alt="" /></a>
                  <p>We are blockchain brand ready</p>
                </li>
                <li class="item menu">
                  <a href="https://yootribe.io/terms" class="link">Terms</a>
                  <a href="https://yootribe.io/legal" class="link">Legal</a>
                  <a href="https://yootribe.io/privacy" class="link">Privacy Policy</a>
                  <a href="https://yootribe.io/antiabuse" class="link">Anti-abuse policy</a>
                </li>

                <li class="item last">
                  <img src={LogoFooterYoutribe} alt="" />
                </li>

              </ul>

            </div>
          </div>
          <div class="sub-footer">
            <p class="copyrights">
              © 2022 Yootribe, SAS, All Rights Reserved
            </p>
          </div>
        </div>
         {/* end footer */}
      </main>
    </div>
  );
};
