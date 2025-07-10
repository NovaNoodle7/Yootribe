import React, {useContext, useEffect, useState} from 'react';
import NftsNavigation from "../../components/micro/NftsNavigation";
import DashContent from "../../components/micro/DashContent";
import {PageHeader} from "../../components/PageHeader";
import {ModalContext} from "../../context/ModalContext";
import {useSelector} from "react-redux";
import {brandAskForChanges, getUserKYB} from "../../api";

const CompanyProfile = () => {
  const { setContent, handleOpen, handleClose } = useContext(ModalContext);
  const [formResult, setFormResult] = useState('');
  const [formError, setFormError] = useState('');
  const [kyb, setKyb] = useState({});
  const [industry, setIndustry] = useState({});
  const [customer, setCustomer] = useState({});
  const [compType, setCompType] = useState({});

  const user = useSelector((state) => state.auth.value.user);

  const industries = [
    {
      name: 'Agriculture',
      _id: 'agriculture',
    },
    {
      name: 'Advertising',
      _id: 'advertising',
    },
    {
      name: 'Chemical industries',
      _id: 'chemical-industries',
    },
    {
      name: 'Commerce',
      _id: 'commerce',
    },
    {
      name: 'Construction',
      _id: 'construction',
    },
    {
      name: 'Education',
      _id: 'education',
    },
    {
      name: 'Entertainment',
      _id: 'entertainment',
    },
    {
      name: 'Financial & insurance',
      _id: 'financial-insurance',
    },
    {
      name: 'Food & drink',
      _id: 'food-drink',
    },
    {
      name: 'Health services',
      _id: 'health-services',
    },
    {
      name: 'hotels-tourism',
      _id: 'hotels-tourism',
    },
    {
      name: 'Marketing & digital services',
      _id: 'marketing-digital-services',
    },
    {
      name: 'News & media',
      _id: 'news-media',
    },
    {
      name: 'Sport',
      _id: 'sport',
    },
    {
      name: 'Technology',
      _id: 'technology',
    },
    {
      name: 'Textiles & clothing',
      _id: 'textiles-clothing',
    },
    {
      name: 'Transport',
      _id: 'transport',
    },
  ];

  const types = [
    {
      name: 'Corporation',
      _id: 'corporation',
    },
    {
      name: 'Limited liability company',
      _id: 'llc',
    },
    {
      name: 'Nonprofit organization',
      _id: 'nonprofit',
    },
    {
      name: 'Partnership',
      _id: 'partnership',
    },
    {
      name: 'Sole proprietorship',
      _id: 'sole-proprietorship',
    },
  ];

  const customers = [
    {
      _id: 'BtoB',
      name: 'BtoB',
    },
    {
      _id: 'BtoC',
      name: 'BtoC',
    },
    {
      _id: 'BtoBtoC',
      name: 'BtoBtoC',
    },
  ];

  useEffect(() => {
    getUserKYB()
      .then(({ kyb }) => {
        if (kyb) {
          setKyb(kyb);

          const filteredIndustries = industries.filter((item) => (item._id === kyb?.industry))
          if (filteredIndustries)
            setIndustry(filteredIndustries[0]);

          const filteredTypes = types.filter((item) => (item._id === kyb?.comp_type))
          if (filteredTypes)
            setCompType(filteredTypes[0]);

          const filteredCustomers = customers.filter((item) => (item._id === kyb?.customers))
          if (filteredCustomers)
            setCustomer(filteredCustomers[0]);
        }
      })
      .catch((err) => {});
  }, []);

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
            currentTab={"Company Profile"}
            title={"Company Profile (KYB)"}
            description={
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur neque nibh, facilisis sed accumsan in, laoreet id felis. Sed aliquet dolor sit amet laoreet faucibus. Donec vitae lectus mollis, vulputate ipsum id, vulputate lorem. Donec risus erat, molestie iaculis ligula eget, imperdiet blandit nisl. Maecenas lobortis elit eget eros iaculis. '
            }
          />

          <div className={'nft-content'}>
            <div className="container">

              {(user?.kyb_passed) ? (
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
                      <label htmlFor={'comp_legal_name'}>Company legal name</label>
                      <input disabled value={kyb?.comp_legal_name} id={'comp_legal_name'} />
                    </div>
                    <div className={'input-wrapper'} >
                      <label htmlFor={'comp_registration'}>Company registration number</label>
                      <input disabled value={kyb?.comp_registration} id={'comp_registration'} />
                    </div>
                  </div>
                  <div className={'inputs-two-cells'}>
                    <div className={'input-wrapper'} >
                      <label htmlFor={'comp_address'}>Country</label>
                      <input disabled value={kyb?.comp_address} id={'comp_address'} />
                    </div>
                    <div className={'input-wrapper'} >
                      <label htmlFor={'city'}>City</label>
                      <input disabled value={kyb?.city} id={'city'} />
                    </div>
                  </div>
                  <div className={'inputs-two-cells'}>
                    <div className={'input-wrapper'} >
                      <label htmlFor={'comp_address'}>Address</label>
                      <input disabled value={kyb?.comp_address} id={'comp_address'} />
                    </div>
                    <div className={'input-wrapper'} >
                      <label htmlFor={'zip'}>ZIP Code</label>
                      <input disabled value={kyb?.zip} id={'zip'} />
                    </div>
                  </div>
                  <div className={'inputs-two-cells'}>
                    <div className={'input-wrapper'} >
                      <label htmlFor={'phone_number'}>Phone Number</label>
                      <input disabled value={kyb?.phone_number} id={'phone_number'} />
                    </div>
                    <div className={'input-wrapper'} >
                      <label htmlFor={'customers'}>Customers</label>
                      <input disabled value={customer?.name} id={'customers'} />
                    </div>
                  </div>
                  <div className={'inputs-two-cells'}>
                    <div className={'input-wrapper'} >
                      <label htmlFor={'comp_type'}>Company Type</label>
                      <input disabled value={compType?.name} id={'comp_type'} />
                    </div>
                    <div className={'input-wrapper'} >
                      <label htmlFor={'industry'}>Industry</label>
                      <input disabled value={industry?.name} id={'industry'} />
                    </div>
                  </div>
                  <div className={'inputs-one-cell'}>
                    <div className={'input-wrapper'} >
                      <label htmlFor="description">Description</label>
                      <textarea
                        id="description"
                        name="description"
                        disabled
                        style={{ width: '100%' }}
                        value={kyb?.description}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <p>
                    Your KYB has not been validated yet.
                  </p>
                </div>
              )}

            </div>
          </div>
        </DashContent>
      </div>
    </main>
  );
};

export default CompanyProfile;
