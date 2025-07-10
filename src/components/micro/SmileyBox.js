import React, { forwardRef } from 'react';
import smileys from '../../static/smiley.json';


const SmileyBox = forwardRef((props, ref) => {
  const { setInput } = props;

  const inputHandler = (smiley) => {
    setInput((prev) => prev + smiley);
  }
  return (
    <div ref={ref} className={'smiley-box'}>
      {smileys.map((item, i) => {
        return (
          <button onClick={() => inputHandler(item)} key={i + 1}>{item}</button>
        );
      })}
    </div>
  );
});

export default SmileyBox;
