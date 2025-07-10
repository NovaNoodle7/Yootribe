import React from 'react';



const BreadCrumbs = ({ children }) => {
  return (
    <div className={'breadcrumbs-wrapper'}>
      {children}
    </div>
  )
};


export default BreadCrumbs;