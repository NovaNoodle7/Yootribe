import React, {useContext, useState} from 'react';
import NftsNavigation from "../../components/micro/NftsNavigation";
import DashContent from "../../components/micro/DashContent";
import {PageHeader} from "../../components/PageHeader";
import {useSelector} from "react-redux";
import './../../scss/style.css'
import {IntlTelInputByIp} from "../../components/IntlTelInputByIp";
import {ModalContext} from "../../context/ModalContext";
import {brandAskForChanges} from "../../api";

const UserProfile = () => {
  const { setContent, handleOpen, handleClose } = useContext(ModalContext);
  const user = useSelector((state) => state.auth.value.user);
  const [formResult, setFormResult] = useState('');
  const [formError, setFormError] = useState('');

  const showPopup = () => {
    setFormResult('');
    setFormError('');

    setContent(
      <form onSubmit={handleSubmit} className="form" style={{ width: '100%', padding: '50px 80px' }}>
        <div className="form-group">
          <label style={{color: 'white'}} htmlFor="message">Please describe the fields you need to change</label>
          <textarea
            id="message"
            name="message"
            required
            style={{ width: '100%' }}
          />
        </div>

        <button className={'action-button outlined white'} type="submit" style={{ width: '100%' }}>
          Send
        </button>
      </form>
    );

    handleOpen();
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormResult('pending');

    brandAskForChanges(e.target[0].value)
      .then(() => {
        setFormResult('OK');
      })
      .catch((error) => {
        setFormResult('KO');
        setFormError(error.message);
      });

    handleClose();
  }

  return (
    <main className="main">
      <div className="main-wapr">
        <NftsNavigation kyc />
        <DashContent>
          <PageHeader
            tabs={false}
            currentTab={"Account Profile"}
            title={"Account Profile (KYC)"}
            description={
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur neque nibh, facilisis sed accumsan in, laoreet id felis. Sed aliquet dolor sit amet laoreet faucibus. Donec vitae lectus mollis, vulputate ipsum id, vulputate lorem. Donec risus erat, molestie iaculis ligula eget, imperdiet blandit nisl. Maecenas lobortis elit eget eros iaculis. '
            }
          />

          <div className={'nft-content'}>
            <div className="container">
              <div className="formik-form">

                <div>
                  <p>
                    If you want to change your informations,
                    <span style={{cursor: 'pointer'}} onClick={showPopup}> please click here</span>.
                  </p>
                </div>

                {formResult === 'pending' && (
                  <div className="col-12 errors bg-warning text-white">
                    The email is on the way, please wait, it won't be long.
                  </div>
                )}
                {formResult === 'OK' && (
                  <div className="col-12 errors bg-success text-white">
                    Email was successfully sent to the admin.
                  </div>
                )}
                {formResult === 'KO' && (
                  <div className="col-12 errors">{formError}</div>
                )}

                <div className={'inputs-two-cells'}>
                  <div className={'input-wrapper'} >
                    <label htmlFor={'first_name'}>First Name</label>
                    <input disabled value={user?.first_name} id={'first_name'} />
                  </div>
                  <div className={'input-wrapper'} >
                    <label htmlFor={'last_name'}>Name</label>
                    <input disabled value={user?.last_name} id={'last_name'} />
                  </div>
                </div>
                <div className={'inputs-two-cells'}>
                  <div className={'input-wrapper'} >
                    <label htmlFor={'company'}>Company</label>
                    <input disabled value={user?.company} id={'company'} />
                  </div>
                  <div className={'input-wrapper'} >
                    <label htmlFor={'job_title'}>Job Title</label>
                    <input disabled value={user?.job_title} id={'job_title'} />
                  </div>
                </div>
                <div className={'inputs-two-cells'}>
                  <div className={'input-wrapper'} >
                    <label htmlFor={'phone'}>Phone number</label>
                    <IntlTelInputByIp
                      style={{ paddingRight: 0 }}
                      value={user?.phone}
                      disabled
                    />
                  </div>
                  <div className={'input-wrapper'} >
                    <label htmlFor={'company_location'}>Company Location</label>
                    <input disabled value={user?.company_location} id={'company_location'} />
                  </div>
                </div>
                <div className={'inputs-two-cells'}>
                  <div className={'input-wrapper'} >
                    <label htmlFor={'email'}>Email</label>
                    <input disabled value={user?.email} id={'email'} />
                  </div>
                  <div className={'input-wrapper'} >
                    <label htmlFor={'company_website'}>Company Website</label>
                    <input disabled value={user?.company_website} id={'company_website'} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DashContent>
      </div>
    </main>
  );
};

export default UserProfile;
