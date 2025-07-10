import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import ContentHeader from './components/micro/ContentHeader';
import DashContent from './components/micro/DashContent';
import NftsNavigation from './components/micro/NftsNavigation';
import { Form, Formik } from 'formik';
import { Dropdown, FileInput, Input, TextField } from './components/micro/FormComponents';
import { getUserKYB, storeKYB } from './api';

import { activeCompteSchema } from './schema/activeUserCompte';

function CreateCampaign() {
  const [kybDetails, setKYBDetails] = useState({});

  useEffect(() => {
    getUserKYB()
      .then(({ kyb }) => {
        setKYBDetails(kyb);
      })
      .catch(console.error);
  }, []);

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

  const user = useSelector((state) => state.auth.value.user);

  const submitKYBForm = (values, { resetForm }) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    storeKYB(formData)
      .then(({ result }) => {
        setKYBDetails(result);
        resetForm();
      })
      .catch((error) => {
        alert('An error occured please again later');
        console.log('error', error);
      });
  };

  return (
    <main className="main">
      <div className="main-wapr">
        <NftsNavigation kyc />
        <DashContent>
          <ContentHeader>
            <div className="container">
              <div className="head-content">
                <h2>Activate your Account</h2>
                <p>
                  We need some basic information about your company, the product or services that it provides, and where
                  it operates.
                </p>
              </div>
            </div>
          </ContentHeader>

          {kybDetails && kybDetails.state !== 'rejected' ? (
            <div className="mt-3 col-12 errors bg-success text-white">
              {kybDetails.state === 'new' ? 'Your KYB is currently under review' : 'Your KYB is already validated'}
            </div>
          ) : (
            <div className="nft-content activate-account">
              <div className="container">
                <Formik
                  initialValues={{
                    comp_legal_name: kybDetails?.comp_legal_name || user?.company || '',
                    website: kybDetails?.website || user?.company_website || '',
                    comp_address: kybDetails?.comp_address || user?.company_location || '',
                    personal_id: kybDetails?.personal_id || '',
                    address_proof: kybDetails?.address_proof || '',
                    bank_details: kybDetails?.bank_details || '',
                    comp_registration: kybDetails?.comp_registration || '',
                    comp_type: kybDetails?.comp_type || '',
                    city: kybDetails?.city || '',
                    zip: kybDetails?.zip || '',
                    phone_number: kybDetails?.phone_number || user?.phone || '',
                    industry: kybDetails?.industry || '',
                    customers: kybDetails?.customers || '',
                    vat_num: kybDetails?.vat_num || '',
                    description: kybDetails?.description || '',
                    address: kybDetails?.address || '',
                  }}
                  validateOnChange={false}
                  validationSchema={activeCompteSchema}
                  onSubmit={submitKYBForm}
                  validateOnBlur={false}
                  // enableReinitialize
                >
                  {({ isSubmitting, values, setFieldValue, setFieldError, errors, touched }) => (
                    <Form className={'formik-form'}>
                      <div className={'inputs-two-cells'}>
                        <Input
                          required
                          errors={errors}
                          label={'Company legal name'}
                          value={values?.comp_legal_name}
                          touched={touched}
                          fieldName={'comp_legal_name'}
                        />
                        <Input
                          required
                          errors={errors}
                          label={'Company registration number'}
                          fieldName={'comp_registration'}
                          value={values?.comp_registration}
                          touched={touched}
                        />
                      </div>
                      <div className={'inputs-two-cells'}>
                        <Input
                          disabled
                          required
                          errors={errors}
                          label={'Country'}
                          fieldName={'comp_address'}
                          value={user?.company_location}
                          touched={touched}
                        />
                        <Input
                          required
                          errors={errors}
                          label={'City'}
                          fieldName={'city'}
                          value={values?.city}
                          touched={touched}
                        />
                      </div>
                      <div className={'inputs-two-cells'}>
                        <Input
                          required
                          errors={errors}
                          label={'Address'}
                          touched={touched}
                          value={values?.address}
                          fieldName={'address'}
                        />
                        <Input
                          required
                          errors={errors}
                          label={'ZIP Code'}
                          touched={touched}
                          fieldName={'zip'}
                          value={values?.zip}
                        />
                      </div>
                      <div className={'inputs-two-cells mixed-inputs'}>
                        <Input
                          required
                          errors={errors}
                          label={'Phone Number'}
                          fieldName={'phone_number'}
                          value={values?.phone_number}
                          touched={touched}
                          className="mt-2"
                          disabled
                        />

                        <Dropdown
                          label={'Customers'}
                          name={'customers'}
                          options={customers}
                          required
                          errors={errors}
                          touched={touched}
                          fieldName={'customers'}
                          value={values?.customers}
                          setOption={(value) => setFieldValue('customers', value)}
                          property={'name'}
                        />
                      </div>
                      <div className={'inputs-two-cells drop-inputs'}>
                        <Dropdown
                          label={'Company Type'}
                          name={'comp_type'}
                          fieldName={'comp_type'}
                          required
                          errors={errors}
                          touched={touched}
                          options={types}
                          value={values?.comp_type}
                          setOption={(value) => setFieldValue('comp_type', value)}
                          property={'name'}
                        />
                        <Dropdown
                          label={'Industry'}
                          name={'industry'}
                          fieldName={'industry'}
                          required
                          touched={touched}
                          errors={errors}
                          options={industries}
                          setOption={(value) => setFieldValue('industry', value)}
                          value={values?.industry}
                          property={'name'}
                        />
                      </div>
                      {/* <div className={'inputs-two-cells'}></div> */}
                      <div className={'inputs-one-cell'}>
                        <TextField
                          label={'Description'}
                          errors={errors}
                          required
                          fieldName={'description'}
                          rows={5}
                          touched={touched}
                          value={values?.description}
                        />
                      </div>
                      <div className={'inputs-two-cells inputs-two-cells-uploads'}>
                        <FileInput
                          accept={'image/png, image/jpeg, application/pdf'}
                          label={'Upload personal ID document'}
                          fieldName={'personal_id'}
                          errors={errors}
                          required
                          touched={touched}
                          buttonText={'Add your document (Jpeg, PNG or PDF)'}
                          onChange={(event) => {
                            setFieldValue('personal_id', event.currentTarget.files[0]);
                          }}
                          file={values?.personal_id}
                        />
                        <FileInput
                          accept={'image/png, image/jpeg, application/pdf'}
                          label={'Upload company proof of address'}
                          fieldName={'address_proof'}
                          errors={errors}
                          required
                          touched={touched}
                          buttonText={'Add your proof of address (Jpeg, PNG or PDF)'}
                          onChange={(event) => {
                            setFieldValue('address_proof', event.currentTarget.files[0]);
                          }}
                          file={values?.address_proof}
                        />
                      </div>
                      <div className={'inputs-two-cells inputs-two-cells-uploads'}>
                        <FileInput
                          accept={'image/png, image/jpeg'}
                          label={'Upload bank details'}
                          fieldName={'bank_details'}
                          errors={errors}
                          required
                          touched={touched}
                          buttonText={'Add your document (Jpeg, PNG or PDF)'}
                          onChange={(event) => {
                            setFieldValue('bank_details', event.currentTarget.files[0]);
                          }}
                          file={values?.bank_details}
                          helpText={'Account number, IBAN, SWIFT, BIC code, ACH routing number ...'}
                        />
                      </div>
                      <div className={'form-footer'}>
                        <button className={'action-button primary'} type="submit" disabled={isSubmitting}>
                          {isSubmitting ? 'Validating...' : 'Validate'}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          )}
        </DashContent>
      </div>
    </main>
  );
}

export default CreateCampaign;
