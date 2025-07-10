import React from 'react';

export default function InputField({
  type,
  id,
  name,
  label,
  errors,
  onChange,
  groupLabel = false,
  value,
  required = false
}) {
  const [show, setShow] = React.useState(false);

  console.log('errors', errors);

  return groupLabel ? (
    <div className={'input-wrapper'}>
      <label htmlFor={id}>
        {label}
        {required && <span className="required-indicator">*</span>}
      </label>
      <div className="input-group">
        <span className="input-group-text">{groupLabel}</span>
        <input type={type} id={id} name={name} value={value} onChange={onChange} />
      </div>
      {errors && errors.map((error) => <p className={'general-error'}>{error.message}</p>)}
    </div>
  ) : (
    <div className={'input-wrapper'}>
      <label htmlFor={id}>
        {label}
        <span className="required-indicator">*</span>
      </label>
      <input type={type} id={id} name={name} value={value} onChange={onChange} />
      {errors && errors.map((error) => <p className={'general-error'}>{error.message}</p>)}
    </div>
  );
}
