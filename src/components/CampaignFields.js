import React, { useState } from 'react';

import { XIcon } from '../assets/icons';
import {listQuestions} from "../api/requests/Questions";

const CampaignFields = ({
  fields,
  fieldsChangeHandler,
  removeField,
  fieldsErrors,
  setField
}) => {
  const [dragged, setDragged] = useState(false);
  const getFieldError = (id) => {
    return fieldsErrors && fieldsErrors.filter((field) => field._id === id)[0];
  };
  const handleDragStart = (event, index) => {
    setDragged(true)
    event.dataTransfer.setData('index', index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event, index) => {
    const draggedIndex = event.dataTransfer.getData('index');
    const newItems = [...fields];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    const itemsWithOrder = newItems.map((objet, index) => {
      return { ...objet, order: index };
    });
    setField(itemsWithOrder);
    setDragged(false)
  };
  return fields.sort((a, b) => a.order - b.order).map((field,index) => (
    <div 
      key={field._id} 
      className={dragged ? 'input-wrapper grabbing' : 'input-wrapper'}
      draggable
      onDragStart={(event) => handleDragStart(event, index)}
      onDragOver={(event) => handleDragOver(event)}
      onDrop={(event) => handleDrop(event, index)}
      >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px',
          alignItems: 'center'
        }}
        className={'checkbox-wrapper'}>
        <label style={{ justifyContent: 'flex-end' }} htmlFor={field._id}>
          {field.categoryLabel !== 'forceRequired' && (
            <input
              onChange={() => fieldsChangeHandler(field._id, { required: !field.required })}
              type={'checkbox'}
              id={field._id}
              checked={field.required}
            />
          )}
          Required
        </label>
        {field.categoryLabel !== 'forceRequired' && (
          <button
            onClick={() => removeField(field._id)}
            className={'action-button small outlined circle'}>
            <XIcon />
          </button>
        )}
      </div>
      <input
        type={'text'}
        id={field._id}
        name={field._id}
        value={field.question}
        disabled={true}
      />
      {/* {field.id === "email" && (
        <p className="field-info">
          Email is always mandatory and cannot be deleted
        </p>
      )} */}

      {getFieldError(field._id) ? (
        <p className="general-error">Please enter a valid field name</p>
      ) : (
        ''
      )}
    </div>
  ));
};

export default CampaignFields;
