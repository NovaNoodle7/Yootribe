import { useEffect } from 'react';
import { useState } from 'react';

const CampaignSchema = {
  user_id: {
    type: 'string',
    requiredForPublishing: true,
    requiredForDraft: true
  },
  nft_id: {
    type: 'string',
    requiredForPublishing: true,
    requiredForDraft: false
  },
  slug: {
    type: 'string',
    requiredForPublishing: true,
    requiredForDraft: true
  },
  name: {
    type: 'string',
    requiredForPublishing: true,
    requiredForDraft: true
  },
  title: {
    type: 'string',
    requiredForPublishing: true,
    requiredForDraft: true
  },
  keywords: {
    type: 'array',
    requiredForPublishing: true,
    requiredForDraft: true,
    validate: (value) => {
      return Array.isArray(value) && value.length;
    }
  },
  fields: {
    type: 'array',
    requiredForPublishing: false,
    requiredForDraft: false
  },
  content: {
    type: 'string',
    requiredForPublishing: true,
    requiredForDraft: false
  },
  website: {
    type: 'string',
    requiredForPublishing: true,
    requiredForDraft: false
  }
};

export const fieldValidator = (e, context = 'draft') => {
  const value = e.target.value;
  const name = e.target.name;
  const fieldSchema = CampaignSchema[name];
  const errors = {};
  let hasErrors = false;

  if (fieldSchema.type === 'string') {
    if (fieldSchema.requiredForPublishing && context === 'save') {
      if (value === '') {
        errors[name] = {
          type: 'required',
          message: `Field ${name} is required`
        };

        hasErrors = true;
      }
    }
    if (fieldSchema.requiredForDraft && context === 'draft') {
      if (value === '') {
        errors[name] = {
          type: 'required',
          message: `Field ${name} is required`
        };

        hasErrors = true;
      }
    }
  }

  if (!hasErrors) {
    delete errors[name];
  }

  return errors;
};

export const arrayFieldValidator = (field, value, context = 'draft') => {
  console.log(field, value);
  if (CampaignSchema[field] && field === 'keywords') {
    const valid = CampaignSchema[field].validate(value);
    console.log('valid', valid);
  }
};
