import React, { useEffect } from 'react';
import { getEthPriceNow } from '../helpers/getCryptoPrice';
import { useState } from 'react';

export const useCurrentEthPrice = () => {
  const [usdPrice, setUsdPrice] = useState(0);

  useEffect(() => {
    getEthPriceNow().then((data) => {
      setUsdPrice(Object.values(data)[0]);
    });
  }, []);

  return usdPrice;
};
