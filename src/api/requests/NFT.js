import Api from '../Api';

/**
 * Only admin users can access this endpoint
 * @param {*} status 
 * @returns array of nfts
 */
export const getNftsByStatus = async (status) =>
  await Api.http({
    method: 'get',
    url: `/nfts/${status}`,
  });

export const claimUserNFT = async (campaign_id) =>
  await Api.http({
    method: 'post',
    url: `/nfts/claim`,
    body: { campaign_id }
  });
