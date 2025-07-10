import React from 'react';
import { Formik, Form } from 'formik';

// Components
import DashContent from '../micro/DashContent';
import { Checkbox, Input } from '../micro/FormComponents';

// Schema
import { createNFTPricingSchema } from '../../schema/createNft';

// Icons
import ethIcon from '../../assets/img/ETH.png';
import polygonIcon from '../../assets/img/polygon.png';

import { useState } from 'react';

const CreateNFTPricing = ({ nftData, setNftData, handleDraftNft, setCurrentTab }) => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const [network, setNetwork] = useState(null);

  return (
    <DashContent>
      <div className="nft-content">
        <div className="container">
          <Formik
            initialValues={{
              is_free: nftData.is_free ? nftData.is_free : false,
              price: nftData.price ? nftData.price : 0,
              copies: nftData.copies ? nftData.copies : 0,
            }}
            validationSchema={createNFTPricingSchema}
            validateOnBlur={true}
            validateOnChange={true}
            validateOnMount={true}
            onSubmit={async (val) => {
              await sleep(500);
              setNftData({ ...nftData, ...val });
              await setCurrentTab('confirmation');
            }}
          >
            {({ errors, values, setFieldValue, isSubmitting }) => {
              return (
                <Form className={'formik-form'}>
                  <div className={'inputs-single-cell'}>
                    <p className="label">
                      Choose your network <span className="required-indicator">*</span>
                    </p>
                    <div className="radio-group">
                      <button
                        className={network === 'eth' ? 'radio-item active' : 'radio-item'}
                        onClick={() => setNetwork('eth')}
                      >
                        <img src={ethIcon} />
                        <span>
                          <strong>Ethereum</strong>
                        </span>
                      </button>
                      <button
                        className={network === 'sol' ? 'radio-item active' : 'radio-item'}
                        onClick={() => setNetwork('sol')}
                      >
                        <span>
                          <img src={polygonIcon} />
                          <strong>Polygon</strong>
                        </span>
                      </button>
                    </div>
                    <p className="field-info">Polygon network is only available for paid subscription</p>
                  </div>
                  <div className={'inputs-single-cell inputs-single-cell-checkboxes'}>
                    <p className="label">
                      Do you want to sell your NFT? <span className="required-indicator">*</span>
                    </p>
                    <Checkbox
                      fieldName={'Yes'}
                      onChange={() => {
                        setFieldValue('is_free', false);
                      }}
                      label={'Yes'}
                      checked={!values.is_free}
                    />
                    <Checkbox
                      fieldName={'No'}
                      onChange={() => {
                        setFieldValue('is_free', true);
                        setFieldValue('price', 0);
                      }}
                      label={'No'}
                      checked={values.is_free}
                    />
                  </div>
                  <div className={'inputs-three-cells'}>
                    <div className="input-container">
                      <Input
                        errors={errors}
                        required={!values.is_free}
                        disabled={values.is_free}
                        fieldName={'price'}
                        label={'What will be the price of sale in €'}
                        type={'number'}
                        default="1"
                        onChange={(e) => {
                          setFieldValue('price', parseInt(e.target.value || 0));
                        }}
                      />
                    </div>
                    <div className="input-container">
                      <Input
                        required
                        errors={errors}
                        fieldName={'copies'}
                        label={`How many copies do you want to ${values.is_free ? 'give' : 'sell'}?`}
                        type={'number'}
                        default="1"
                        onChange={(e) => {
                          setFieldValue('copies', parseInt(e.target.value || 0));
                        }}
                      />
                    </div>

                    <div className="input-container">
                      <Input
                        required
                        errors={errors}
                        fieldName={'royalties'}
                        label={`Royalties (Percentage Fee)`}
                        type={'number'}
                        placeholder={'0.00 - 50'}
                      />
                      <p className="field-info">Only available for paid subscription</p>
                    </div>
                  </div>
                  <div>
                    {/* <p className="field-info service-fee">
                    The service fee of minting your NFT will be {values.copies} x 3 € ={' '}
                    {values.copies * 3} €{' '}
                  </p> */}
                  </div>

                  <div className={'form-footer'}>
                    <button
                      type={'button'}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentTab('info');
                      }}
                      className={'action-button secondary back'}
                    >
                      Go back
                    </button>
                    <button
                      disabled={Object.keys(errors).length > 0}
                      onClick={(e) => {
                        e.preventDefault();
                        handleDraftNft({ ...nftData, ...values });
                      }}
                      className={'action-button secondary'}
                    >
                      {isSubmitting ? 'Saving ...' : 'Save draft'}
                    </button>
                    <button type={'submit'} className={'action-button primary'}>
                      Continue
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </DashContent>
  );
};

export default CreateNFTPricing;
