import React from 'react';
import { registerUser, validateUserCompany } from '../../../api';
import { IntlTelInputByIp } from '../../../components/IntlTelInputByIp';

import 'react-intl-tel-input/dist/main.css';
import '../bootstrap.min.css';
import '../style.css';

import LogoYoutribe from '../../../assets/img/img_footer/logo-yootribe.png';
import LogoFooterYoutribe from '../../../assets/img/img_footer/logo-footer-yootribe.jpg';

export const RegisterUser = () => {
  const [registerData, setRegisterData] = React.useState({
    company_location: 'United States',
  });
  const [formError, setFormError] = React.useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const regex = /^[0-9\b]+$/;
    if (name === 'phone' && value && !regex.test(value)) {
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

  const onSubmit = (e) => {
    e.preventDefault();

    if (registerData.agree) {
      if (registerData.company) {
        validateUserCompany({ search: registerData.company })
          .then((res) => {
            if (res.isValid) {
              sendUserRegistration();
            } else {
              throw new Error('Company is not valid!');
            }
          })
          .catch((error) => {
            console.log(error);
            setFormError(error.message);
          });
      } else {
        sendUserRegistration();
      }
    }
  };

  const sendUserRegistration = () => {
    const formData = {};
    Object.keys(registerData).forEach((key) => {
      if (key === 'confirm_password') {
        return;
      }

      formData[key] = registerData[key];
    });

    return registerUser(formData)
      .then(({ user }) => {
        window.location.replace('https://yootribe.io/thankyou-brand');
      })
      .catch((error) => {
        setFormError(error.message);
      });
  };

  return (
    <div className="register-page body-bg">
      <main className="main">
        <div className="main_form" style={{ height: 'calc(100vh - 106px)' }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="register-sec">
                  <h3>Sign up with for NFT</h3>
                  <p>
                    Revolutionize your lead generation strategy with NFT and Web3 Wallet
                  </p>
                  <form className="form registration-form" onSubmit={onSubmit}>
                    {formError && <div className="col-12 errors">{formError}</div>}
                    <div className="row">
                      <div className="form-group col-md-6">
                        <input
                          name="first_name"
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
                          name="company"
                          type="text"
                          className="form-control"
                          placeholder="Company name"
                          required
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group col-md-6">
                        <select
                          name="job_title"
                          id="job_select"
                          className="form-control custom-select"
                          onChange={handleChange}
                          required="true"
                        >
                          <option value="CEO">CEO</option>
                          <option value="CFO">CFO</option>
                          <option value="CTO">CTO</option>
                          <option value="CMO">CMO</option>
                          <option value="Director">Director</option>
                          <option value="Sales">Sales</option>
                        </select>
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-md-6">
                        <IntlTelInputByIp
                          style={{ paddingRight: 0 }}
                          onPhoneNumberChange={(isValid, number) =>
                            handleChange({ target: { name: 'phone', value: number } })
                          }
                          onSelectFlag={(number, flag) => {
                            handleChange({
                              target: {
                                name: 'company_location',
                                value: flag.name,
                              },
                            });
                          }}
                          value={registerData.phone}
                          placeholder={'Phone number'}
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <input
                          name="company_location"
                          type="text"
                          className="form-control"
                          placeholder="Company location"
                          id="companyLocation"
                          value={registerData?.company_location}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-md-6">
                        <input
                          name="email"
                          type="email"
                          className="form-control"
                          placeholder="Email address"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group col-md-6">
                        <input
                          name="company_website"
                          type="text"
                          className="form-control"
                          placeholder="Company website"
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-md-6">
                        <div className="password-eye">
                          <input
                            name="password"
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            required
                            pattern="^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$"
                            onInvalid={(e) =>
                              e.target.setCustomValidity(
                                'Password must contain at least one number and one uppercase and lowercase letter and special character, and at least 8 or more characters'
                              )
                            }
                            onInput={(e) => e.target.setCustomValidity('')}
                            onChange={handleChange}
                          />
                          <span
                            toggle="#password-field"
                            className="fa fa-fw fa-eye field-icon toggle-password show-password"
                          ></span>
                        </div>
                      </div>
                      <div className="form-group col-md-6">
                        <input
                          name="confirm_password"
                          type="password"
                          className="form-control"
                          placeholder="Retype Password"
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 mb-0">
                      <span className="error"></span>
                    </div>

                    <div className="col-12 mb-0">
                      <div className="custom-control custom-checkbox flex-check">
                        <input
                          name="agree"
                          type="checkbox"
                          className="custom-control-input"
                          id="accept"
                          onChange={handleChange}
                          required
                        />
                        <label
                          className="label custom-control-label form-check-label label-create-compte"
                          htmlFor="accept"
                        >
                          I certify that I am 18 years of age or older, I agree to the{' '}
                          <a href="https://yootribe.io/terms" target="_blank">
                            Terms
                          </a>
                          , and I have read the
                          <a href="https://yootribe.io/privacy" target="_blank">
                            Privacy Policy
                          </a>
                          .
                        </label>
                      </div>
                    </div>
                    <div className="form-group row_center">
                      <button type="submit" className="btn btn-primary submit-button btn-custom">
                        Validate
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <footer style={{ display: 'flex', alignItems: 'center', color: 'grey', fontWeight: 600, height: '40px' }}>
          <span>&copy; 2022 Yootribe, SAS, All Rights Reserved</span>
        </footer> */}

        <div className="footer-login">
          <div className="bottomFooter">
            <div className="container-footer">
              <ul className="list">


                <li className="item first">
                  <a className="navbar-brand" href="/"><img src={LogoYoutribe} alt="" /></a>
                  <p>We are blockchain brand ready</p>
                </li>
                <li className="item menu">
                  <a href="https://yootribe.io/terms" className="link">Terms</a>
                  <a href="https://yootribe.io/legal" className="link">Legal</a>
                  <a href="https://yootribe.io/privacy" className="link">Privacy Policy</a>
                  <a href="https://yootribe.io/antiabuse" className="link">Anti-abuse policy</a>
                </li>

                <li className="item last">
                  <img src={LogoFooterYoutribe} alt="" />
                </li>

              </ul>

            </div>
          </div>
          <div className="sub-footer">
            <p className="copyrights">
              © 2022 Yootribe, SAS, All Rights Reserved
            </p>
          </div>
        </div>

      </main>
    </div>
  );
};
