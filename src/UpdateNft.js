import React, { useState, useEffect, useContext } from 'react';
import { Formik, Form } from 'formik';

import { useSelector, useDispatch } from 'react-redux';

import { useNavigate, useParams } from 'react-router-dom';

// Components
import DashContent from './components/micro/DashContent';
import { TextField, Input, FileInput, Checkbox } from './components/micro/FormComponents';
import { editNFTSchema } from './schema/createNft';

import { updateNFT } from './store/nftSlice';
import { ToastContext } from './context/ToastContext';
import { PageHeader } from './components/PageHeader';
import UpdateNFTConfirmation from './components/NFT/CreateConfirmation';

const UpdateNft = () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const nfts = useSelector((state) => state.nft.nfts);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleToast } = useContext(ToastContext);

  const { id } = useParams();

  const [nftData, setNftData] = useState(null);
  const [dataEdit,setDataEdit] = useState(null);
  const [nftImage, setNftImage] = useState(null);
  const [updateNFTPayment,setUpdateNFTPayment] = useState(false);
  const [currentTabNFTUpdate, setCurrentTabNFTUpdate] = useState('confirmation');

  const handleUpdate = async (data) => {
    const tempNft = { ...nftData, ...data, image: nftImage, status: 'draft' };
    dispatch(updateNFT(tempNft)).then((response) => {
      if (updateNFTPayment === true){
        handleToast(`Update of ${tempNft.name} is successful`, 'success');
        navigate('/dashboard/nfts');
      }else{
        setDataEdit({...nftData, ...data});
        setUpdateNFTPayment(true);
      }
    });
  };

  const nftCounts = useSelector((state) => state.dashboard.counts.nfts);

  useEffect(() => {
    setNftData(nfts.find((item) => item._id === id));
  }, []);

  useEffect(() => {
    if (nftData && nftData.image) {
      fetch(`${process.env.REACT_APP_API}/uploads/${nftData.image}`)
        .then((res) => res.blob())
        .then((blob) => {
          setNftImage(blob);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [nftData]);

  const tabs = {
    edit: {
      name: 'Edit NFT',
      hidden: true,
    },
    draft: {
      name: 'Draft NFTS',
      count: nftCounts.draft,
      onClick: () =>
        navigate('/dashboard/nfts', {
          state: {
            currentTab: 'draft',
          },
        }),
    },
    live: {
      name: 'Live NFTS',
      count: nftCounts.live,
      onClick: () =>
        navigate('/dashboard/nfts', {
          state: {
            currentTab: 'live',
          },
        }),
    },
  };

  const tabsPayment = {
    confirmation: {
      title: 'NFT PAYMENT',
      name: 'Edit NFT (Confirmation)',
      hidden: true
    },
  }

  return (
    <main className="main">
      {updateNFTPayment ?
        <PageHeader
          tabs={tabsPayment}
          currentTab={currentTabNFTUpdate}
          setCurrentTab={() => { }}
          title={tabsPayment[currentTabNFTUpdate]?.title}
          description="Re-invent your relationship with your customers, fans, leads...<br>Go beyond and have unforgettable experiences tied to your NFT and your target group."
        />
       :
        <PageHeader tabs={tabs} currentTab={'edit'} title={nftData?.name} description={nftData?.description} />}
      
 
      {updateNFTPayment?
        <UpdateNFTConfirmation
          nftData={dataEdit}
          setNftData={setNftData}
          handleDraftNft={handleUpdate}
          setCurrentTab={setUpdateNFTPayment}
          typeConfirmation="update"
        />
       :
        <DashContent>
          <div className="nft-content">
            <div className="container">
              {nftData && (
                <Formik
                  initialValues={{
                    name: nftData?.name ? nftData.name : '',
                    description: nftData?.description ? nftData.description : '',
                    message: nftData?.message ? nftData.message : '',
                    is_free: typeof nftData.is_free !== 'undefined' ? nftData?.is_free : null,
                    copies: nftData?.copies ? nftData.copies : 0,
                    price: nftData?.price && !nftData.is_free ? nftData.price : 0,
                    image: nftData?.image ? nftData.image : null,
                  }}
                  validationSchema={editNFTSchema}
                  validateOnChange={true}
                  validateOnBlur={false}
                  onSubmit={async (val) => {
                    await sleep(500);
                    handleUpdate(val);
                  }}
                >
                  {({ isSubmitting, values, setFieldValue,setFieldError, errors }) => {
                    return (
                      <Form className={'formik-form'}>
                        <div className="form-line form-line-first">
                          <div className="nft-image">
                            <img src={`${process.env.REACT_APP_API}/uploads/` + nftData?.image} alt={'current nft'} />
                          </div>
                        </div>
                        <div className={'inputs-two-cells'}>
                          <Input
                            required
                            errors={errors}
                            label={'NFT Name'}
                            fieldName={'name'}
                            placeholder={'Enter Your NFT name...'}
                          />
                          <div className={'inputs-one-cell'}>
                            <FileInput
                              accept={'image/png, image/jpeg'}
                              label={'NFT Image'}
                              fieldName={'image'}
                              
                              onChange={(event) => {const extension = event.currentTarget.files[0].name.split('.').pop();
                                if(extension === "png" || extension === "jpeg" || extension === "jpg"){
                                  setNftImage(event.currentTarget.files[0]);
                                  setFieldError("image",null)
                                }
                                else
                                  setFieldError("image","Uploading this file is not allowed")
                                }}
                              buttonText={'Add your NFT Image (Jpeg or PNG)'}
                              required
                              errors={errors}
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
                              label={'Secret message'}
                              fieldName={'message'}
                              rows={10}
                              placeholder={'Add a message...'}
                            />
                            <p className="field-info">
                              This will be the first interaction with customer in case of resell
                            </p>
                          </div>
                        </div>
                        <div className={'inputs-two-cells'}>
                          <div className={'inputs-single-cell'}>
                            <p>
                              Do you want to sell your NFT? <span className={'required-indicator'}>*</span>
                            </p>
                           <div className='d-flex mt-2'>
                              <Checkbox
                                fieldName={'Yes'}
                                onChange={() => setFieldValue('is_free', false)}
                                label={'Yes'}
                                checked={!values.is_free && values.is_free !== null}
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
                            {errors && errors.is_free && <p className={'general-error'}> {errors.is_free}</p>}
                          </div>

                        </div>
                        <div className={'inputs-three-cells'}>
                          <div className="input-container">
                            <Input
                              type={'number'}
                              errors={errors}
                              required={!values.is_free}
                              disabled={values.is_free}
                              fieldName={'price'}
                              label={'What will be the price of sale?'}
                              onChange={(e) => {
                                setFieldValue('price', parseInt(e.target.value));
                              }}
                            />
                          </div>
                          <div className="input-container">
                            <Input
                              type={'number'}
                              errors={errors}
                              required
                              fieldName={'copies'}
                              label={`How many copies do you want to ${!values.is_free ? 'sell' : 'give'}?`}
                              onChange={(e) => {
                                setFieldValue('copies', parseInt(e.target.value));
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
                        <p
                          style={{
                            alignSelf: 'flex-end',
                            marginTop: '30px',
                            marginBottom: '10px',
                          }}
                        >
                          The service fee of minting your NFT will be {values.copies} x 3 $ ={' '}
                          <strong>{values.copies * 3} $</strong>
                        </p>
                        <div className={'form-footer'}>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              navigate('/dashboard/nfts');
                            }}
                            className={'action-button secondary back'}
                          >
                            Go back
                          </button>
                          <button className={'action-button primary'} type="submit">
                            {isSubmitting ? <span>Validate ...</span> : <span>Validate</span>}
                          </button>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              )}
            </div>
          </div>
        </DashContent>
      
      }

    </main>
  );
};

export default UpdateNft;
