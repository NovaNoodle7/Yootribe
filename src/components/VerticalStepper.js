import React from 'react';


const VerticalStepper = ({ steps, currentTab }) => {
  return (
    <div className="vertical-stepper">
      <ol className="c-timeline">
        {steps?.map((item, i) => (
          <li key={i + 1} className={`c-timeline__item ${item.type === currentTab ? 'active' : ''}`}>
            <div className="c-timeline__content">
              <h3 className="c-timeline__title">{item.stepName}</h3>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
};

export default VerticalStepper;