import React, { useState } from 'react';
import { Formik, Form } from 'formik';

// Components
import DashContent from '../micro/DashContent';
import { FileInput, Input, TextField, Checkbox } from '../micro/FormComponents';

// Schema
import { createNFTSchema } from '../../schema/createNft';

import ethIcon from '../../assets/img/ETH.png';
import polygonIcon from '../../assets/img/polygon.png';

const CreateNFTInfo = ({ nftData, setNftData, handleDraftNft, setCurrentTab }) => {
  const [network, setNetwork] = useState('sol');
  const [stateHover, setStateHover] = useState(false);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const parseValue =(value)=>{
    if (isNaN(value) || value === "") {
      return 0;
    }else{
      return parseInt(value);
    }
  }

  const handleHoverOn=()=>{
    setStateHover(true);
  }

 const handleHoverOff=()=>{
   setStateHover(false);
  }

  return (
    <DashContent>
      <div className="nft-content">
        <div className="container create-nft">
          <Formik
            initialValues={{
              name: nftData.name ? nftData.name : '',
              image: nftData.image ? nftData.image : null,
              description: nftData.description ? nftData.description : '',
              message: nftData.message ? nftData.message : '',
              is_free: nftData.is_free ? nftData.is_free : false,
              price: nftData.price ? nftData.price : 0,
              copies: nftData.copies ? nftData.copies : 0,
            }}

            // validateOnBlur={true}
            // validateOnChange={true}
            // validateOnMount={true}
            validateOnChange={false}
            validateOnBlur={false}
            validationSchema={createNFTSchema}
            onSubmit={async (values) => {
              await sleep(500);
              setNftData({ ...nftData, ...values });
              await setCurrentTab('confirmation');
            }}>
            {({ isSubmitting, values, setFieldValue,setFieldError, errors }) => (
              <Form className={'formik-form'}>
                <div className={'inputs-two-cells'}>
                  <Input
                    errors={errors}
                    required
                    label={'NFT Name'}
                    fieldName={'name'}
                    placeholder={'Enter Your NFT name...'}
                  />
                  <div className={'inpusts-one-cell'}>
                    <FileInput
                      accept={'image/png, image/jpeg'}
                      label={'NFT Image'}
                      fieldName={'image'}
                      errors={errors}
                      required
                      buttonText={'Add your NFT Image (Jpeg or PNG)'}
                      onChange={(event) => {
                        const extension = event.currentTarget.files[0].name.split('.').pop();
                        if(extension === "png" || extension === "jpeg" || extension === "jpg"){
                          setFieldValue('image', event.currentTarget.files[0])
                          setFieldError("image",null)
                        }
                        else
                         setFieldError("image","Uploading this file is not allowed")
                      }}
                      file={values.image}
                    />
                  </div>
                </div>
                <div className={'inputs-two-cells'}>
                  <div className="input-wrapper text-area-wrapper">
                    <TextField
                      errors={errors}
                      required
                      label={'Add a description'}
                      fieldName={'description'}
                      rows={10}
                      placeholder={'Add a description...'}
                    />
                  </div>
                  <div className="text-area-wrapper">
                    <TextField
                      errors={errors}
                      required
                      label={'Secret Message'}
                      fieldName={'message'}
                      rows={10}
                      placeholder={'Add secret message to the owner'}
                    />
                    <p className="field-info">
                      This will be the first interaction with customer in case of resell
                    </p>
                  </div>
                </div>

                <div className={'inputs-single-cell'}>
                  <p className="label">
                    Choose your network <span className="required-indicator">*</span>
                  </p>
                  <div className="radio-group">
                    <div
                      onMouseEnter={handleHoverOn}
                      onMouseLeave={handleHoverOff}
                      style={{width:'154px',height:'39px',display:'flex',justifyContent:'center',alignItems:'center'}}
                    >
                      {stateHover === false ? <button
                        className={network === 'eth' ? 'radio-item active' : 'radio-item'}
                      // onClick={() => setNetwork('eth')}
                      >
                        <img src={ethIcon} />
                        <span>
                          <strong>Ethereum</strong>
                        </span>

                      </button>:<p style={{ fontSize: '13px', color: 'red' }}>Available soon</p>}
                    </div>
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
                  <div className='d-flex'>
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
                        setFieldValue('price', parseValue(e.target.value));
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
                        setFieldValue('copies', parseValue(e.target.value));
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

                <div className={'form-footer'}>
                  <button
                    onClick={() => handleDraftNft(values)}
                    className={'action-button secondary'}>
                    {isSubmitting && values.draft ? 'Saving ...' : 'Save draft'}
                  </button>
                  <button className={'action-button primary'} type="submit">
                    {isSubmitting && !values.draft ? 'Validation ...' : 'Validate'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </DashContent>
  );
};

export default CreateNFTInfo;
