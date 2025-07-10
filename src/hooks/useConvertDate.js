import React from 'react';


const useConvertDate = (date) => {
  const fullDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  const isoDate = fullDate.toISOString();
  const localeDate = fullDate.toLocaleString();
  return {
    fullDate,
    isoDate,
    localeDate,
  };
}

export default useConvertDate;