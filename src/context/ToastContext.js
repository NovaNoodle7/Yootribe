import React, { createContext, useEffect, useState } from 'react';
import { ToastContainer, toast, Slide } from 'react-toastify';


export const ToastContext = createContext({
  handleToast: () => { }
});

const ToastProvider = ({ children }) => {
  const handleToast = (message, type) => {
    toast[type](message);
  }
  
  return (
    <ToastContext.Provider value={{ handleToast }}>
      {children}
      <ToastContainer
        position={'top-right'}
        autoClose={2000}
        closeOnClick
        transition={Slide}
        limit={2}
      />
    </ToastContext.Provider>
  )
}


export default ToastProvider;