import React from 'react';


const useImgToBlob = (file) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    console.log(event);
  };
  reader.readAsDataURL(file);
};


export default useImgToBlob;