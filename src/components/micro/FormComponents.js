import React, { useRef, useState } from 'react';
import { Field } from 'formik';
import DatePicker from 'react-datepicker';
import ReactChipInput from 'react-chip-input';

import { PlusIcon, XIconLight } from '../../assets/icons';

export const Input = ({ type, fieldName, label, required,value, errors = {}, ...rest }) => {

  return (
    <div className={'input-wrapper'}>
      <label htmlFor={fieldName}>
        {label}
        {required && <span className="required-indicator">*</span>}
      </label>

      <Field type={'text'} id={fieldName} name={fieldName} {...rest} />
      <div className="with-counter">
        {Object.keys(errors).length > 0 && value === "" && errors[fieldName]&& (
          <p className={'general-error'}> {errors[fieldName]}</p>
        )}
      </div>
    </div>
  );
};

export const FileInput = ({
  fieldName,
  label,
  required,
  buttonText,
  errors = {},
  file,
  helpText = null,
  ...rest
}) => {
  const fileInput = useRef(null);
  return (
    <div className={'input-wrapper'}>
      <label>
        {label} {required && <span className="required-indicator">*</span>}
      </label>
      <button
        onClick={(e) => {
          e.preventDefault();
          fileInput.current.click();
        }}
        type={'button'}
        className={'file-input-button'}
        htmlFor={fieldName}
      >
        <PlusIcon />
        {file ? file.name : rest.edit ? rest.edit : buttonText}
      </button>
      <input
        ref={fileInput}
        hidden
        className={'input-file'}
        type={'file'}
        id={fieldName}
        name={fieldName}
        {...rest}
      />

      {helpText && (
        <small style={{width:"100%"}}>{helpText}</small>
      )}
      {file ? '' : Object.keys(errors).length > 0 && errors[fieldName] && <p className={'general-error'}> {errors[fieldName]}</p>}
    </div>
  );
};

export const TextField = ({ fieldName, label, required, value, errors = {}, ...rest }) => {
  return (
    <div className={'input-wrapper'}>
      <label htmlFor={fieldName}>
        {label}
        {required && <span className="required-indicator">*</span>}
      </label>
      <Field as={'textarea'} id={fieldName} name={fieldName} {...rest} />
      {Object.keys(errors).length > 0 && value=== "" && errors[fieldName] && (
        <p className={'general-error'}> {errors[fieldName]}</p>
      )}
    </div>
  );
};

export const Checkbox = ({ fieldName, label, required, ...rest }) => {
  return (
    <div className={'checkbox-wrapper'}>
      <Field id={fieldName} type={'checkbox'} name={fieldName} {...rest} />
      <label htmlFor={fieldName}>
        {label}
        {required && <span className="required-indicator">*</span>}
      </label>
    </div>
  );
};


export const Dropdown = ({ name, label, options,fieldName, required, setOption, errors = {},  value, defaultValue, property, ...rest }) => {
  return (
    <div className={'dropdown'}>
      <input type={'checkbox'} className={'dropdown__switch'} id={`filter-switch-${name}`} hidden />
      <label htmlFor={`filter-switch-${name}`} className={'dropdown__options-filter'}>
        <div>{label}{required && <span className="required-indicator">*</span>}</div>
        <ul className={'dropdown__filter'} role={'listbox'} tabIndex={'-1'}>
          <li className={'dropdown__filter-selected'}>
            {value === null ? defaultValue : ''}
            {value ? ((property) ? options.filter((_option) => _option._id === value)[0][property] : options.filter((_option) => _option === value)[0]) : label}
            {value && (
              <button
                onClick={() => {
                  setOption(null);
                }}>
                {<XIconLight />}
              </button>
            )}
          </li>
          <li>
            <ul className={'dropdown__select'}>
              {options && options.length ? (
                options.map((item, index) => {
                  const id = (property) ? item._id : item
                  if (id !== value) {
                    return (
                      <li
                        key={id}
                        className={'dropdown__select-option'}
                        aria-selected={'false'}
                        role={'option'}
                        onClick={() => {
                          setOption(id);
                        }}>
                        {(property) ? item[property] : item}
                      </li>
                    );
                  }
                  return null;
                })
              ) : (
                <div className="dropdown__select-option dropdown__select-disabled">
                  Please create NFT to create new campaign
                </div>
              )}
            </ul>
          </li>
        </ul>
      </label>
      {Object.keys(errors).length > 0 && value === "" && errors[fieldName] && (
        <p className={'general-error'}> {errors[fieldName]}</p>
      )}
    </div>
  );
};

export const CampaignDropdown = ({ label, options, required, setOption, value, ...rest }) => { 
  const [selectedOption, setSelectedOption] = useState(value);
  return (
    <div className={'dropdown'}>
      <input type={'checkbox'} className={'dropdown__switch'} id={'filter-switch'} hidden />
      <label htmlFor={'filter-switch'} className={'dropdown__options-filter'}>
        {rest.labelActive?label:''}
        <ul className={'dropdown__filter'} role={'listbox'} tabIndex={'-1'}>
          <li className={'dropdown__filter-selected'}>
            {selectedOption ? options?.[0]?.name : label}
            {selectedOption && (
              <button
                onClick={() => {
                  setOption('');
                  setSelectedOption('');
                }}>
                {<XIconLight />}
              </button>
            )}
          </li>
          <li>
            <ul className={'dropdown__select'}>
              {options?.map((item, index) => {
                if (item._id !== value) {
                  return (
                    <li
                      key={index + 1}
                      className={'dropdown__select-option'}
                      aria-selected={'false'}
                      role={'option'}
                      onClick={() => {
                        setOption(item._id);
                        setSelectedOption(item.name);
                      }}>
                      {item.name}
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </li>
        </ul>
      </label>
    </div>
  );
};

export const DragNDrop = ({ handleChange, fileTypes, file }) => { };

export const KeywordsInput = ({ setState, state }) => {
  const addChip = (val) => {
    if (val) {
      setState((prevState) => [...prevState, val.replaceAll(/[^a-z]/ig, '')]);
    }
  };

  const removeChip = (index) => {
    const tempChips = state.filter((item, i) => i !== index);
    setState(tempChips);
  };

  // TODO autocomplete dropdown using listKeywords()

  return (
    <ReactChipInput
      classes={'chip-input-main keywords-input'}
      chips={state}
      onSubmit={addChip}
      onRemove={(index) => removeChip(index)}
    />
  );
};

export const DateTimePicker = ({ setDate, date, ...rest }) => {
  return (
    <DatePicker
      selected={date}
      onChange={(date) => setDate(date)}
      timeInputLabel={'Time:'}
      dateFormat={'MM-dd-yyyy h:mm aa'}
      showTimeInput
      {...rest}
    />
  );
};
