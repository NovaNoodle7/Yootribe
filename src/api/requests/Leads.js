import Api from '../Api';

/**
 * Only admin users can access this endpoint
 * @returns array of leads
 */
export const getAllLeads = async () =>
  await Api.http({
    method: 'get',
    url: '/leads/all',
  });
