import Api from '../Api';

/**
 * Only admin users can access this endpoint
 * @returns array of users
 */
export const getAllUsers = async () =>
  await Api.http({
    method: 'get',
    url: '/users/all',
  });

export const validateUserByEmail = async (email, campaignId) =>
  await Api.http({
    method: 'post',
    url: '/check-lead-in-campaign',
    body: { email, campaignId },
  });

export const brandAskForChanges = async (message) =>
  await Api.http({
    method: 'post',
    url: '/users/ask-for-changes',
    body: { message },
  });
