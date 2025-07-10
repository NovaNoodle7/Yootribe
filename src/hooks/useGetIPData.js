import React from 'react';

const apiKey = process.env.REACT_APP_IPDATA_APIKEY;
export const useGetIPData = (ip) => {
  const [data, setData] = React.useState({});

  let url = `https://api.ipdata.co?api-key=${apiKey}`;
  if (ip) {
    url = `https://api.ipdata.co/${ip}?api-key=${apiKey}`;
  }

  React.useEffect(() => {
    fetch(url)
      .then(async (response) => setData(await response.json()))
      .catch((error) => console.error(error));
  }, [url]);

  return data;
};
