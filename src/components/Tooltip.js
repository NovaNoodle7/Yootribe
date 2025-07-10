import React from 'react';

export default function Tooltip({ children, text, ...rest }) {
  const [show, setShow] = React.useState(false);

  return (
    <div className={'tooltip-wrapper'}>
      <div className='tooltip' style={show ? { visibility: 'visible' } : {}}>
        {text}
        <span className='tooltip-arrow' />
      </div>
      <div
        className={'tooltip-container'}
        {...rest}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
    </div>
  );
}
