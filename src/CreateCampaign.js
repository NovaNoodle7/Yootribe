import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { ToastContext } from './context/ToastContext';
import DashContent from './components/micro/DashContent';
import { createCampaign } from './store/campaignSlice';
import useConvertDate from './hooks/useConvertDate';

import { DragNDrop, Dropdown, FileInput, KeywordsInput, DateTimePicker } from './components/micro/FormComponents';
import { ModalContext } from './context/ModalContext';

import { Editor } from '@tinymce/tinymce-react';

import CampaignFields from './components/CampaignFields';

import { PageHeader } from './components/PageHeader';
import { getInitialNft } from './store/nftSlice';
import { ApiAxios } from './api/Api';
import { getQuestionById, listQuestions } from './api/requests/Questions';

const CreateCampaign = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();

  const editorRef = useRef(null);

  const user = useSelector((state) => state.auth?.value?.user);
  const user_id = user?._id;
  const allNfts = useSelector((state) => state.nft.nfts);

  const { handleToast } = useContext(ToastContext);
  const { setContent, handleOpen } = useContext(ModalContext);

  const getEndDate = () => {
    const current_date = new Date();
    current_date.setDate(current_date.getDate() + 3);

    return current_date;
  };

  const [availableNFT, setAvailableNFT] = useState([]),
        [inputFields, setInputFields] = useState({}),
        [errorBaner, setErrorBaner] = useState(''),
        [errorLogo, setErrorLogo] = useState(''),
        [date, setDate] = useState(getEndDate()),
        [parsedDate, setParsedDate] = useState(''),
        [nftId, setNftId] = useState(null),
        [nftSlug, setNftSlug] = useState(''),
        [slugAvailable, setSlugAvailable] = useState(null),
        [keywords, setKeywords] = useState([]),
        [formErrors, setFormErrors] = useState([]),
        [fieldsErrors, setFieldsErrors] = useState([]),
        [fields, setFields] = useState([]),
        [availableFields, setAvailableFields] = useState([]),
        [availableFieldsForDropdown, setAvailableFieldsForDropdown] = useState([
          { _id: 'noId', question: 'First select a category' },
        ]),
        [categoryToAdd, setCategoryToAdd] = useState(null),
        [fieldToAdd, setFieldToAdd] = useState(null),
        [fieldToAddDefaultValue, setFieldToAddDefaultValue] = useState(null),
        [stateDisabled, setStateDisabled] = useState(false),
        [editorValue,setEditorValue]= useState('');
        

  useEffect(() => {
    dispatch(getInitialNft({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps

    listQuestions()
      .then((res) => {
        res.list.map((item) => {
          if (item.preSelectedOrder !== undefined) {
            fields[item.preSelectedOrder] = item;
          } else {
            if (availableFields[item.categoryLabel]) {
              let category = availableFields[item.categoryLabel];
              availableFields[item.categoryLabel] = [...category, item];
            } else {
              availableFields[item.categoryLabel] = [item];
            }
          }
        });
        handleAddCategory(null);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleAddCategory = (category) => {
    if (category) {
      setCategoryToAdd(category);
      setAvailableFieldsForDropdown(availableFields[category]);
      setFieldToAddDefaultValue(availableFields[category][0]?.question);
      setFieldToAdd(availableFields[category][0]?._id);
    } else {
      setAvailableFieldsForDropdown([{ _id: 'noId', question: 'First Select a category' }]);
      setCategoryToAdd(null);
      setFieldToAdd(null);
    }
  };



  const fieldsChangeHandler = (id, row) => {
    const tempData = fields.map((item) => {
      if (item._id === id) {
        return {
          ...item,
          ...row,
        };
      } else {
        return item;
      }
    });
    setFields(tempData);
  };

  const addField = () => {
    if (categoryToAdd && fieldToAdd) {
      getQuestionById(fieldToAdd)
        .then((res) => {
          let category = availableFields[categoryToAdd].filter((field) => field._id !== res.question._id);
          if (category) {
            availableFields[categoryToAdd] = category;
          } else {
            setAvailableFields(availableFields.filter((fields, categ) => categ !== categoryToAdd));
          }
          setFields((prevState) => [...prevState, res.question]);
          handleAddCategory(null);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const removeField = (id) => {
    const fieldToRemove = fields.find((item) => item._id === id);
    setFields(fields.filter((item) => item._id !== id));

    if (availableFields[fieldToRemove.categoryLabel]) {
      let category = availableFields[fieldToRemove.categoryLabel];
      availableFields[fieldToRemove.categoryLabel] = [...category, fieldToRemove];
    } else {
      availableFields[fieldToRemove.categoryLabel] = [fieldToRemove];
    }
  };



  const inputChangeHandler = (e) => {
    if (e.target.value !== '') {
      setFormErrors(formErrors.filter((name) => name !== e.target.name));
    } else {
      formErrors.push(e.target.name);
      setFormErrors(formErrors);
    }
    if (e.target.name === 'slug') {
      const { value } = e.target;
      const tempValue = value
        .replace('yootribe.com/auth/register/campaign/', '')
        .replace(/[^A-Z]+/gi, '_')
        .toLowerCase();
      setNftSlug(tempValue);
    }
    setInputFields({
      ...inputFields,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (type) => {
    if(type === "finish"){
      if (user.kyb_passed === false) {
        return handleToast(`Your account must be approved to submit a campaign.`, 'warning');
      }
    }
    let tempErrors = [];
    const tempFields = fields.map((item) => {
      return {
        id: item._id,
        required: item.categoryLabel === 'forceRequired' || item.required,
      };
    });

    const fieldsErrors = fields.filter((field) => {
      return (field.type === 'dropdown' && field.options.length === 0) || field.placeholder === '';
    });

    setFieldsErrors(fieldsErrors);

    const tempData = {
      ...inputFields,
      fields: tempFields,
      content: editorRef.current.getContent(),
      user_id: user_id,
      nft_id: nftId,
      slug: nftSlug,
      keywords: keywords,
      status: 'draft',
      ends_at: parsedDate,
    };

    if (!tempData.website)
      tempErrors.push('website');
    if (!tempData.name)
      tempErrors.push('name');
    if ((tempData.slug === 'yootribe.com/auth/register/campaign/' || tempData.slug === '') && type !== 'save') {
      setSlugAvailable(null);
      tempErrors.push('slug');
    }
    if (!tempData.title && type !== 'save')
      tempErrors.push('title');
    if (tempData.keywords.length === 0 && type !== 'save')
      tempErrors.push('keywords');
    if (!tempData.cover && type !== 'save')
      tempErrors.push('cover');
    if (!tempData.logo && type !== 'save')
      tempErrors.push('logo');
    if (!tempData.content && type !== 'save')
      tempErrors.push('content');
    if ((!tempData.nft_id || tempData.nft_id === '') && type !== 'save' && type !== 'preview')
      tempErrors.push('nft_id');

      if (type === 'preview'&&!tempErrors.includes('name')&&!tempErrors.includes('slug')&&!tempErrors.includes('title')&&!tempErrors.includes('keywords')&&!tempErrors.includes('cover')&&!tempErrors.includes('logo')&&!tempErrors.includes('content')){
      const { payload } = await dispatch(createCampaign({ campaign: tempData }));
      navigate(`/dashboard/campaigns/edit/${payload.campaign._id}`);
      window.open(`${window.location.origin}/auth/register/campaign/${nftSlug}`, '_blank');
    }
    setFormErrors(tempErrors);
    if (tempErrors.length === 0 && fieldsErrors.length === 0) {
      if (type === 'save') {
        dispatch(createCampaign({ campaign: tempData }));
        handleToast(`Succesfully saved ${tempData.title}`, 'success');
        navigate('/dashboard/campaigns', {
          state: {
            currentTab: state.currentTab,
          },
        });
      }
      if (type === 'finish' && (user.kyb_passed || user.is_superadmin)) {
        const tempStatus = {
          ...tempData,
          status: 'adminApproval',
        };
        dispatch(createCampaign({ campaign: tempStatus }));
        handleOpen();
        setContent(
          <div className='create-create-compagn-modal'>
            <p>We appreciate your submission.<br/>
              Our team will review your campaign and will quickly notify you by email once it has been approved.</p>
          </div>
        );
        navigate('/dashboard/campaigns', {
          state: {
            currentTab: state.currentTab,
          },
        });
      }
    } else {
      if (tempErrors.length >= 2) {
        const element = document.getElementById('scroll-error-field');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
       if (tempErrors.includes('nft_id')){
          const element = document.getElementById('nft-place');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }

    }
  };

  const handleCheckSlug = async () => {
    try {
      await ApiAxios.get('/campaigns/slugCheck', {
        params: {
          slug: nftSlug,
        },
      });

      setSlugAvailable(true);
    } catch (err) {
      setSlugAvailable(false);
      setFormErrors([...formErrors, 'slug']);
    }
  };

  const handleDragNDrop = (file, type) => {
    setInputFields({
      ...inputFields,
      [type]: file,
    });
  };

  useEffect(() => {
    const tempNFTS = allNfts.filter((item) => item.status !== 'draft' && !item.campaign);
    setAvailableNFT(tempNFTS);
  }, [allNfts]);

  useEffect(() => {
    if (keywords.length) {
      setFormErrors(formErrors.filter((error) => error !== 'keywords'));
    }
  }, [keywords]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const tempDate = useConvertDate(date).isoDate;
    setParsedDate(tempDate);
  }, [date]);

  const campaignCounts = useSelector((state) => state.dashboard.counts.campaigns);
  const tabs = {
    draft: {
      title: 'DRAFT CAMPAIGN',
      name: 'Draft Campaign',
      onClick: () => {
        navigate('/dashboard/campaigns', {
          state: {
            currentTab: 'draft',
          },
        });
      },
      count: campaignCounts.draft,
    },
    live: {
      title: 'LIVE CAMPAIGN',
      name: 'Live Campaign',
      onClick: () => {
        navigate('/dashboard/campaigns', {
          state: {
            currentTab: 'live',
          },
        });
      },
      count: campaignCounts.live,
    },
    whitelisted: {
      title: 'WHITELISTED CAMPAIGNS',
      name: 'Whitelist results',
      onClick: () => {
        navigate('/dashboard/campaigns', {
          state: {
            currentTab: 'whitelisted',
          },
        });
      },
      count: campaignCounts.whitelisted,
    },
  };

  const handleEditor=(e)=>{
    setEditorValue(e.target.value);
  }

  return (
    <main className="main">
      <PageHeader
        tabs={tabs}
        title={tabs[state?.currentTab]?.title || 'Create Campaigns'}
        description="Easily distribute your NFT via a simple interface.<br />Gather all the data from your leads, provide them with a social portfolio that can dive into the Web3."
      />

      <DashContent>
        <div className="nft-content">
          <div className="container">
            <div className={'formik-form'}>
              <div className={'inputs-two-cells'} id="scroll-error-field">
                <div className={'input-wrapper'}>
                  <label htmlFor={'name'}>
                    {'Campaign Name'}
                    <span className="required-indicator">*</span>
                  </label>
                  <input type={'text'} id={'name'} name={'name'} onChange={inputChangeHandler} />
                  {formErrors.includes('name') && <p className={'general-error'}>Campaign name is mandatory</p>}
                </div>
                <div className={'input-wrapper'}>
                  <label htmlFor={'slug'}>
                    {'Campaign Slug'}
                    <span className="required-indicator">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type={'text'}
                      id={'slug'}
                      name={'slug'}
                      value={`${nftSlug}`}
                      placeholder={null}
                      onChange={inputChangeHandler}
                      onBlur={() => {
                        if (nftSlug) handleCheckSlug();
                      }}
                    />
                  </div>

                  {formErrors.includes('slug') && <p className={'general-error'}>Campaign slug is mandatory</p>}
                  {slugAvailable && <p className={'general-success'}>Campaign slug is available</p>}
                </div>
              </div>
              <div className={'inputs-two-cells'}>
                <div className={'input-wrapper'}>
                  <label htmlFor={'title'}>
                    {'Campaign Title'}
                    <span className="required-indicator">*</span>
                  </label>
                  <input type={'text'} id={'title'} name={'title'} onChange={inputChangeHandler} defaultValue={''} />
                  {formErrors.includes('title') && <p className={'general-error'}>Campaign title is mandatory</p>}
                  <p className="field-info">This title will show under your banner</p>
                </div>
                <div className={'input-wrapper'}>
                  <label htmlFor={'title'}>
                    {'Project website'}
                    <span className="required-indicator">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type={'text'}
                      id={'website'}
                      name={'website'}
                      placeholder="www."
                      onChange={inputChangeHandler}
                      defaultValue={''}
                    />
                  </div>
                  {formErrors.includes('website') && <p className={'general-error'}>Campaign website is mandatory</p>}
                  <p className="field-info">This field should not be a Twitter or Discord web address</p>
                </div>
              </div>
              <div className={'inputs-two-cells'}>
                <div>
                  <label htmlFor={'keywords'}>
                    {'Campaign keywords'}
                    <span className="required-indicator">*</span>
                  </label>
                  <KeywordsInput state={keywords} setState={setKeywords} />
                  {formErrors.includes('keywords') && (
                    <p className={'general-error'}>Campaign keywords are mandatory</p>
                  )}
                </div>
                <div className={'input-wrapper'}>
                  <label htmlFor={'title'}>
                    {'Campaign End Time'}
                    <span className="required-indicator">*</span>
                  </label>
                  <DateTimePicker setDate={setDate} date={date} minDate={getEndDate()} />
                </div>
              </div>
              <div style={{ alignItems: 'flex-start' }} className={'inputs-two-cells'}>
                <div className={'inputs-one-cell'}>


                  <FileInput
                    fieldName={'cover'}
                    required
                    label={'Campaign Banner'}
                    accept={'image/png, image/jpeg'}
                    buttonText={'Add banner ( Jpeg or png )'}
                    onChange={(event) => {
                      const extension = event.currentTarget.files[0].name.split('.').pop();
                      if(extension === "png" || extension === "jpeg" || extension === "jpg"){
                        setErrorBaner('');
                        setInputFields({
                          ...inputFields,
                          [event.target.name]: event.currentTarget.files[0],
                        });
                      }else{
                        setErrorBaner('Uploading this file is not allowed')
                      }
                    }}
                    file={inputFields.cover}
                  />
                  <p className="field-info">
                    This will go at the top of the project page as a header. We recommend 1400x300.
                  </p>
                  <DragNDrop
                    fileTypes={['JPG', 'PNG', 'JPEG']}
                    handleChange={(file) => handleDragNDrop(file, 'cover')}
                    file={inputFields.cover}
                  />
                  {inputFields.cover && (
                    <button
                      type={'button'}
                      className={'action-button secondary'}
                      onClick={() => setInputFields({ ...inputFields, cover: null })}
                    >
                      Remove image
                    </button>
                  )}
                  {formErrors.includes('cover') && !inputFields.cover? <p className={'general-error'}>Campaign banner is mandatory</p>:''}
                  {errorBaner ? <p className={'general-error'}>{errorBaner}</p> : null}
                </div>


                <div className={'inputs-one-cell'}>
                  <FileInput
                    required
                    fieldName={'logo'}
                    label={'Campaign Logo'}
                    accept={'image/png, image/jpeg'}
                    buttonText={'Add logo ( Jpeg or png )'}
                    onChange={(event) => {
                      const extension = event.currentTarget.files[0].name.split('.').pop();
                      if(extension === "png" || extension === "jpeg" || extension === "jpg"){
                        setErrorLogo('');
                        setInputFields({
                          ...inputFields,
                          [event.target.name]: event.currentTarget.files[0],
                        });
                      }else{
                        setErrorLogo('Uploading this file is not allowed')
                      }
                    }}
                    file={inputFields.logo}
                  />
                  <p className="field-info">This will be shown as the logo of your campaign. We recommend 500x500</p>
                  <DragNDrop
                    fileTypes={['JPG', 'PNG', 'JPEG']}
                    handleChange={(file) => handleDragNDrop(file, 'logo')}
                    file={inputFields.logo}
                  />
                  {inputFields.logo && (
                    <button
                      type={'button'}
                      className={'action-button secondary'}
                      onClick={() => setInputFields({ ...inputFields, logo: null })}
                    >
                      Remove image
                    </button>
                  )}
                  {formErrors.includes('logo') && !inputFields.logo? <p className={'general-error'}>Campaign logo is mandatory</p>:''}
                  {errorLogo ? <p className={'general-error'}>{errorLogo}</p> : null}
                </div>
              </div>
              <div className={'inputs-one-cell'}>
                <h3 style={{ marginBottom: '10px' }}>
                  Description<span className="required-indicator">*</span>
                </h3>
                <Editor
                  apiKey="nt6aaz1i9ea2zhdq10qljv6u3r44pp32rcl4dqpltzsezord"
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  onEditorChange={(newValue, editor) => {
                    setEditorValue(newValue);
                  }}
                  initialValue=""
                  onKeyDown={(e) => handleEditor(e)}
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                      'advlist',
                      'autolink',
                      'lists',
                      'link',
                      'image',
                      'charmap',
                      'preview',
                      'anchor',
                      'searchreplace',
                      'visualblocks',
                      'fullscreen',
                      'insertdatetime',
                      'media',
                      'table',
                      'wordcount',
                    ],
                    toolbar:
                      'undo redo fontfamily fontsize | ' +
                      'forecolor bold italic | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | image link fullscreen',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
                    lists_indent_on_tab: false,
                    font_formats:
                      'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
                    branding: false,
                    font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
                    file_picker_callback: function (cb, value, meta) {
                      var input = document.createElement("input");
                      input.setAttribute("type", "file");
                      input.setAttribute("accept", "image/*");
                      input.onchange = function () {
                        var file = this.files[0];
        
                        var reader = new FileReader();
                        reader.onload = function () {
                          var id = "blobid" + new Date().getTime();
                          var blobCache = editorRef.current.editorUpload.blobCache;
                          var base64 = reader.result.split(",")[1];
                          var blobInfo = blobCache.create(id, file, base64);
                          blobCache.add(blobInfo);
        
                          /* call the callback and populate the Title field with the file name */
                          cb(blobInfo.blobUri(), { title: file.name });
                        };
                        reader.readAsDataURL(file);
                      };
                      input.click();
                    }
                  }}
                />

                {formErrors.includes('content') && !editorValue? <p className={'general-error'}>Campaign description is mandatory</p>:''}
              </div>
              <div className={'inputs-one-cell'} id="nft-place">
                <Dropdown
                  label={'Select your NFT'}
                  required
                  options={availableNFT}
                  value={nftId}
                  setOption={setNftId}
                  property={'name'}
                />
                {formErrors.includes('nft_id') && !nftId? <p className={'general-error'}>NFT is mandatory</p>:''}
              </div>
            </div>
            <div className="formik-form">
              <h3 className='mt-4 title-collect-data'>Datas you want to collect</h3>
              <div className={'inputs-two-cells inputs-two-cells-datas'}>
                <CampaignFields
                  fields={fields}
                  fieldsChangeHandler={fieldsChangeHandler}
                  removeField={removeField}
                  fieldsErrors={fieldsErrors}
                />
              </div>

              <div className="add-new-datas" style={{ marginTop: '0.3rem' }}>
                <h3>Add new Datas</h3>
                {Object.keys(availableFields).length > 0 && (
                  <>
                    <div className={'add-new-options mr-auto'}>
                      <div className={'d-flex'}>
                        <div className={'input-wrapper'}>
                          <Dropdown
                            label={false}
                            name={'category_to_add'}
                            options={Object.keys(availableFields)}
                            value={categoryToAdd}
                            defaultValue={'Category'}
                            setOption={handleAddCategory}
                            property={null}
                          />
                        </div>
                        <div className={'input-wrapper select-two'}>
                          <Dropdown
                            label={false}
                            name={'field_to_add'}
                            options={availableFieldsForDropdown}
                            value={fieldToAdd}
                            defaultValue={
                              availableFieldsForDropdown[0]?._id === 'noId'
                                ? 'First Select a Category'
                                : fieldToAddDefaultValue
                            }
                            setOption={setFieldToAdd}
                            property={'question'}
                          />
                        </div>

                      </div>
                    </div>
                    <button onClick={addField} className={'action-button'}>
                      Add selected field
                    </button>
                  </>
                )}
              </div>
              <div className={'form-footer'}>
                <button
                  onClick={() => {
                    onSubmit('preview');
                  }}
                  className="action-button outlined"
                >
                  <span>Click here to preview your campaign</span>
                </button>
              </div>
              <div className={'form-footer'}>
                <button onClick={() => onSubmit('save')} className={'action-button secondary'}>
                  {'Save draft'}
                </button>
                <button
                  disabled={stateDisabled}
                  onClick={() => onSubmit('finish')}
                  className={user.kyb_passed === false ? 'action-button primary desabled' : 'action-button primary'}
                  type="submit"
                >
                  {'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashContent>
    </main>
  );
};

export default CreateCampaign;
