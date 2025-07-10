const defaultCurrencies = 'BTC,USD,EUR,AUD,CHF,CAD,GBP';

exports.getEthPriceNow = async (toSymbol) => {
  let now = new Date().getTime();
  let ts = new Date(now);

  // params
  if (typeof toSymbol === 'string') {
    toSymbol = toSymbol.toUpperCase();
  } else {
    toSymbol = defaultCurrencies;
  }

  const query = new URLSearchParams({
    fsym: 'MATIC',
    tsyms: toSymbol,
    sign: true,
  });

  const response = await fetch(`https://min-api.cryptocompare.com/data/price?${query.toString()}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return {
    [ts]: {
      MATIC: await response.json(),
    },
  };
};
