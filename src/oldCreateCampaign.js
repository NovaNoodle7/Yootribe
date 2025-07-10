import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContext } from './context/ToastContext';

import NftsNavigation from './components/micro/NftsNavigation';
import DashContent from './components/micro/DashContent';
import ContentHeader from './components/micro/ContentHeader';
import BreadCrumbs from './components/micro/Breadcrumbs';
import { createCampaign, getInitialCampaigns } from './store/campaignSlice';

import {
  DragNDrop,
  Dropdown,
  FileInput,
  ChipInput,
  DateTimePicker
} from './components/micro/FormComponents';
import { ModalContext } from './context/ModalContext';

import homeIcon from './assets/img/home.png';
import campaignIcon from './assets/img/campaign.png';

import { Editor } from '@tinymce/tinymce-react';

import CampaignFields from './components/CampaignFields';
import { ApiAxios } from './Api';

const CreateCampaign = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();

  const editorRef = useRef(null);

  const user_id = useSelector((state) => state.auth.value.user._id);
  const allNfts = useSelector((state) => state.nft.nfts);

  const { handleToast } = useContext(ToastContext);
  const { setContent, handleOpen } = useContext(ModalContext);

  const [availableNFT, setAvailableNFT] = useState([]);
  const [inputFields, setInputFields] = useState({});
  const [date, setDate] = useState(new Date());
  const [nftId, setNftId] = useState(null);
  const [nftSlug, setNftSlug] = useState('');
  const [slugAvailable, setSlugAvailable] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [formErrors, setFormErrors] = useState([]);
  const [fieldsErrors, setFieldsErrors] = useState([]);
  const [fields, setFields] = useState([
    {
      id: 'first_name',
      placeholder: 'First Name',
      required: true,
      type: 'text'
    },
    {
      id: 'last_name',
      placeholder: 'Last Name',
      required: true,
      type: 'text'
    },
    {
      id: 'email',
      placeholder: 'Email',
      required: true,
      type: 'text'
    },
    {
      id: 'phone_number',
      placeholder: 'Phone number',
      required: true,
      type: 'text'
    }
  ]);

  const fieldsChangeHandler = (id, row) => {
    const tempData = fields.map((item) => {
      if (item.id === id) {
        if (row.placeholder) {
          if (row.placeholder.length === 0) {
            fieldsErrors.push(item);
            setFieldsErrors(fieldsErrors);
          } else {
            fieldsErrors && setFieldsErrors(fieldsErrors.filter((field) => field.id !== id));
          }
        }
        return {
          ...item,
          ...row
        };
      } else {
        return item;
      }
    });
    setFields(tempData);
  };

  const multipleFieldsChangeHandler = (fieldId, optionId, value) => {
    let tempData;

    if (!optionId) {
      tempData = fields.map((field) => {
        if (field.placeholder.length === 0) {
          fieldsErrors.push(field);
          setFieldsErrors(fieldsErrors);
        } else {
          setFieldsErrors(fieldsErrors.filter((_field) => fieldId !== _field.id));
        }

        if (field.id === fieldId) {
          return {
            ...field,
            placeholder: value
          };
        }

        return field;
      });

      setFields(tempData);

      return;
    }

    tempData = fields.map((field) => {
      if (field.id === fieldId) {
        return {
          ...field,
          options: field.options.map((option) => {
            if (option.id === optionId) {
              console.log('te');
              option.value = value;
            }
            return option;
          })
        };
      }

      return field;
    });
    setFields(tempData);
  };
  const removeField = (id) => {
    const tempData = fields.filter((item) => item.id !== id);
    setFields(tempData);
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
        .replace('yootribe.com/campaign/', '')
        .replace(/[^A-Z]+/gi, '_')
        .toLowerCase();
      setNftSlug(tempValue);
    }
    setInputFields({
      ...inputFields,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = async (type) => {
    window.scrollTo(0, 0);

    let tempErrors = [];
    const tempFields = fields.map((item) => {
      return {
        ...item,
        id: item.placeholder.replace(/[^A-Z0-9]+/gi, '_').toLowerCase()
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
      ends_at: date.toISOString()
    };

    if (!tempData.name) {
      tempErrors.push({
        fleld: 'name',
        type: 'required'
      });
    }
    if ((tempData.slug === 'yootribe.com/campaign/' || tempData.slug === '') && type !== 'save') {
      setSlugAvailable(null);
      tempErrors.push({
        field: 'slug',
        type: 'required',
        message: 'Campaign slug is mandatory'
      });
    }
    if (!tempData.title && type !== 'save') {
      tempErrors.push({
        field: 'title',
        type: 'required',
        message: 'Campaign title is mandatory'
      });
    }
    if (tempData.keywords.length === 0 && type !== 'save') {
      tempErrors.push({
        field: 'keywords',
        type: 'required',
        message: 'Campaign ke is mandatory'
      });
    }
    if (!tempData.cover && type !== 'save') {
      tempErrors.push({
        field: 'cover',
        type: 'required'
      });
    }
    if (!tempData.logo && type !== 'save') {
      tempErrors.push({
        field: 'logo',
        type: 'required'
      });
    }
    if (!tempData.content && type !== 'save') {
      tempErrors.push({
        field: 'content',
        type: 'required'
      });
    }
    if ((!tempData.nft_id || tempData.nft_id === '') && type !== 'save' && type !== 'preview') {
      tempErrors.push({
        field: 'nft_id',
        type: 'required'
      });
    }

    if (!tempData.website && type !== 'save') {
      tempErrors.push({
        field: 'website',
        type: 'required'
      });
    }

    setFormErrors(tempErrors);

    console.log('tempErrors', tempErrors);
    console.log('fieldsErrors', fieldsErrors);
    if (tempErrors.length === 0 && fieldsErrors.length === 0) {
      if (type === 'preview') {
        const { payload } = await dispatch(createCampaign({ campaign: tempData }));
        await navigate(`/dashboard/campaigns/edit/${payload.campaign._id}`);
        window.open(`${window.location.origin}/campaign/${nftSlug}`, '_blank');
      }
      if (type === 'save') {
        dispatch(createCampaign({ campaign: tempData }));
        handleToast(`Succesfully saved ${tempData.title}`, 'success');
        navigate('/dashboard/campaigns', {
          state: {
            currentTab: state.currentTab
          }
        });
      }
      if (type === 'finish') {
        const tempStatus = {
          ...tempData,
          status: 'adminApproval'
        };
        dispatch(createCampaign({ campaign: tempStatus }));
        handleOpen();
        setContent(
          'We appreciate your submission.\nOur team will review your campaign and will quickly notify you by email once it has been approved.'
        );
        navigate('/dashboard/campaigns', {
          state: {
            currentTab: state.currentTab
          }
        });
      }
    }
  };

  const handleCheckSlug = async () => {
    try {
      const { data } = await ApiAxios.get('/campaigns/slugCheck', {
        params: {
          slug: nftSlug
        }
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
      [type]: file
    });
  };

  const addOption = (id) => {
    const tempData = fields.filter((item) => {
      if (item.id === id) {
        item.options = [
          ...item.options,
          {
            value: 'Choice',
            id: `option_${Math.floor(Math.random() * 999)}`
          }
        ];
      }

      return item;
    });

    setFields(tempData);
  };

  const removeOption = (fieldId, optionId) => {
    const tempData = fields.filter((item) => {
      if (item.id === fieldId) {
        item.options = item.options.filter((option) => {
          return option.id !== optionId;
        });
      }

      return item;
    });

    setFields(tempData);
  };

  useEffect(() => {
    const tempNFTS = allNfts.filter((item) => item.status === 'draft');
    setAvailableNFT(tempNFTS);
  }, [allNfts]);

  useEffect(() => {
    if (keywords.length) {
      setFormErrors(formErrors.filter((error) => error !== 'keywords'));
    }
  }, [keywords]);

  const showFieldErrors = (field) => {
    const fieldErrors = formErrors.filter((errors) => {
      return errors.field === field;
    });

    if (fieldErrors) {
      return <p className={'general-error'}>{field.message}</p>;
    }
  };

  return (
    <main className="main">
      <div className="main-wapr">
        <NftsNavigation campaign />
        <DashContent>
          <ContentHeader>
            <BreadCrumbs>
              <button className={'root-nav'}>
                <img src={homeIcon} alt={'home-icon'} />
                <span>Dashboard</span>
              </button>
              <span className={'breadcrumb-separator'}> / </span>
              <button className={'active'}>Campaigns</button>
            </BreadCrumbs>
            <div className="head-content">
              <h2>Create a Campaign</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sed purus nec
                sapien laoreet dictum. Vivamus odio purus, malesuada non eros in, tincidunt varius
                arcu.
              </p>
            </div>
          </ContentHeader>
          <div className="nft-content">
            <div className={'formik-form'}>
              <div className={'inputs-two-cells'}>
                <div className={'input-wrapper'}>
                  <label htmlFor={'name'}>
                    {'Campaign Name'}
                    <span className="required-indicator">*</span>
                  </label>
                  <input type={'text'} id={'name'} name={'name'} onChange={inputChangeHandler} />
                  {formErrors.includes('name') && (
                    <p className={'general-error'}>Campaign name is mandatory</p>
                  )}
                </div>
                <div className={'input-wrapper'}>
                  <label htmlFor={'slug'}>
                    {'Campaign Slug'}
                    <span className="required-indicator">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">yootribe.com/campaign/</span>
                    <input
                      type={'text'}
                      id={'slug'}
                      name={'slug'}
                      value={`${nftSlug}`}
                      onChange={inputChangeHandler}
                      onBlur={() => {
                        if (nftSlug) handleCheckSlug();
                      }}
                    />
                  </div>

                  {showFieldErrors('slug')}

                  {formErrors.includes('slug') && (
                    <p className={'general-error'}>Campaign slug is mandatory</p>
                  )}
                  {slugAvailable && <p className={'general-success'}>Campaign slug is available</p>}
                </div>
              </div>
              <div className={'inputs-two-cells'}>
                <div className={'input-wrapper'}>
                  <label htmlFor={'title'}>
                    {'Campaign Title'}
                    <span className="required-indicator">*</span>
                  </label>
                  <input
                    type={'text'}
                    id={'title'}
                    name={'title'}
                    onChange={inputChangeHandler}
                    defaultValue={''}
                  />
                  {formErrors.includes('title') && (
                    <p className={'general-error'}>Campaign title is mandatory</p>
                  )}
                  <p className="field-info">This title will show under your banner</p>
                </div>
                <div className={'input-wrapper'}>
                  <label htmlFor={'title'}>
                    {'Project website'}
                    <span className="required-indicator">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">www.</span>
                    <input
                      type={'text'}
                      id={'website'}
                      name={'website'}
                      onChange={inputChangeHandler}
                      defaultValue={''}
                    />
                  </div>
                  {formErrors.includes('website') && (
                    <p className={'general-error'}>Campaign website is mandatory</p>
                  )}
                  <p className="field-info">
                    This field should not be a Twitter or Discord web address
                  </p>
                </div>
              </div>
              <div className={'inputs-two-cells'}>
                <div>
                  <label htmlFor={'keywords'}>
                    {'Campaign keywords'}
                    <span className="required-indicator">*</span>
                  </label>
                  <ChipInput state={keywords} setState={setKeywords} />
                  {formErrors.includes('keywords') && (
                    <p className={'general-error'}>Campaign keywords are mandatory</p>
                  )}
                </div>
                <div className={'input-wrapper'}>
                  <label htmlFor={'title'}>
                    {'Campaign End Time'}
                    <span className="required-indicator">*</span>
                  </label>
                  <DateTimePicker setDate={setDate} date={date} minDate={new Date()} />
                </div>
              </div>
              <div style={{ alignItems: 'flex-start' }} className={'inputs-two-cells'}>
                <div className={'inputs-one-cell'}>
                  <FileInput
                    fieldName={'cover'}
                    p
                    required
                    label={'Campaign Banner'}
                    accept={'image/png, image/jpeg'}
                    buttonText={'Add banner ( Jpeg or png )'}
                    onChange={(event) => {
                      setInputFields({
                        ...inputFields,
                        [event.target.name]: event.currentTarget.files[0]
                      });
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
                      onClick={() => setInputFields({ ...inputFields, cover: null })}>
                      Remove image
                    </button>
                  )}
                  {formErrors.includes('cover') && (
                    <p className={'general-error'}>Campaign banner is mandatory</p>
                  )}
                </div>
                <div className={'inputs-one-cell'}>
                  <FileInput
                    required
                    fieldName={'logo'}
                    label={'Campaign Logo'}
                    accept={'image/png, image/jpeg'}
                    buttonText={'Add logo ( Jpeg or png )'}
                    onChange={(event) => {
                      setInputFields({
                        ...inputFields,
                        [event.target.name]: event.currentTarget.files[0]
                      });
                    }}
                    file={inputFields.logo}
                  />
                  <p className="field-info">
                    This will be shown as the logo of your campaign. We recommend 500x500
                  </p>
                  <DragNDrop
                    fileTypes={['JPG', 'PNG', 'JPEG']}
                    handleChange={(file) => handleDragNDrop(file, 'logo')}
                    file={inputFields.logo}
                  />
                  {inputFields.logo && (
                    <button
                      type={'button'}
                      className={'action-button secondary'}
                      onClick={() => setInputFields({ ...inputFields, logo: null })}>
                      Remove image
                    </button>
                  )}
                  {formErrors.includes('logo') && (
                    <p className={'general-error'}>Campaign logo is mandatory</p>
                  )}
                </div>
              </div>
              <div className={'inputs-one-cell'}>
                <h3 style={{ marginBottom: '10px' }}>
                  Description<span className="required-indicator">*</span>
                </h3>
                <Editor
                  apiKey="nt6aaz1i9ea2zhdq10qljv6u3r44pp32rcl4dqpltzsezord"
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  initialValue=""
                  onKeyDown={(e) => {}}
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
                      'wordcount'
                    ],
                    toolbar:
                      'undo redo fontfamily fontsize | ' +
                      'forecolor bold italic | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | image link fullscreen',
                    content_style:
                      'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
                    lists_indent_on_tab: false,
                    font_formats:
                      'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
                    branding: false,
                    font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt'
                  }}
                />

                {formErrors.includes('content') && (
                  <p className={'general-error'}>Campaign description is mandatory</p>
                )}
              </div>
              <div className={'inputs-one-cell'}>
                {availableNFT.length === 0 && (
                  <p className={'general-error'}>Please create NFT to create new campaign</p>
                )}
                <Dropdown
                  label={'Select your NFT'}
                  options={availableNFT}
                  value={nftId}
                  setOption={setNftId}
                  property={"name"}
                />
                {formErrors.includes('nft_id') && (
                  <p className={'general-error'}>NFT is mandatory</p>
                )}
              </div>
            </div>
            <div className="formik-form">
              <h3>Datas you want to collect</h3>
              <div className={'inputs-two-cells inputs-two-cells-datas'}>
                <CampaignFields
                  fields={fields}
                  fieldsChangeHandler={fieldsChangeHandler}
                  multipleFieldsChangeHandler={multipleFieldsChangeHandler}
                  removeField={removeField}
                  addOption={addOption}
                  removeOption={removeOption}
                  fieldsErrors={fieldsErrors}
                />
              </div>
              <div className={'add-new-options'}>
                <button
                  onClick={() =>
                    setFields([
                      ...fields,
                      {
                        id: `dropdown_${Math.floor(Math.random() * 999)}`,
                        placeholder: 'Title',
                        required: false,
                        type: 'dropdown',
                        options: []
                      }
                    ])
                  }
                  className={'action-button'}>
                  Add multiple choices
                </button>
                <button
                  onClick={() =>
                    setFields([
                      ...fields,
                      {
                        id: `default_${Math.floor(Math.random() * 999)}`,
                        placeholder: 'Default',
                        required: false,
                        type: 'text'
                      }
                    ])
                  }
                  className={'action-button'}>
                  Add single choice
                </button>
              </div>
              <div className={'form-footer'}>
                <button
                  onClick={() => {
                    onSubmit('preview');
                  }}
                  className="action-button outlined">
                  <span>Click here to preview your campaign</span>
                </button>
              </div>
              <div className={'form-footer'}>
                <button onClick={() => onSubmit('save')} className={'action-button secondary'}>
                  {'Save draft'}
                </button>
                <button
                  onClick={() => onSubmit('finish')}
                  className={'action-button primary'}
                  type="submit">
                  {'Validate'}
                </button>
              </div>
            </div>
          </div>
        </DashContent>
      </div>
    </main>
  );
};

export default CreateCampaign;
