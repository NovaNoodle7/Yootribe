import Api from '../Api';

export const getAuthUser = async () => {
  if (!localStorage.getItem('token')) {
    return;
  }

  return await Api.http({
    method: 'get',
    url: '/profile',
  });
};

export const validateUserCompany = async (data) =>
  await Api.http({
    method: 'post',
    url: '/validate-user-company',
    body: data,
  });

export const registerUser = async (data) =>
  await Api.http({
    method: 'post',
    url: '/register',
    body: data,
  }).then((res) => {
    return res;
  });

export const registerWallet = async (data) =>
  await Api.http({
    method: 'post',
    url: '/register-user',
    body: data,
  }).then((res) => {
    localStorage.setItem('token', res.token);

    return res;
  });

export const updateWallet = async (data) =>
  await Api.http({
    method: 'post',
    url: '/update-user',
    body: data,
  });

export const registerNewCampaignUser = async (data) =>
  await Api.http({
    method: 'post',
    url: '/leads',
    body: data,
  });

/**
 * @param {Object.<string, *>} data
 * @returns
 */
export const loginAuthUser = async (data) =>
  await Api.http({
    method: 'post',
    url: '/login',
    body: data,
  }).then((res) => {
    localStorage.setItem('token', res.token);

    return res;
  });

/**
 * @param {Object.<string, *>} data
 * @returns
 */
export const loginLeadAndAssignCampaign = async (data) =>
  await Api.http({
    method: 'post',
    url: '/login-lead-and-assign-campaign',
    body: data,
  }).then((res) => {
    localStorage.setItem('token', res.token);

    return res;
  });

export const updatePassword = async (data) =>
  await Api.http({
    method: 'post',
    url: '/update-password',
    body: data,
  });

/**
 * @param {Object} data
 * @param {String} data.email
 * @returns
 */
export const userForgotPassword = async (data) =>
  await Api.http({
    method: 'post',
    url: '/forgot-password',
    body: data,
  });

export const userResetPassword = async (data) =>
  await Api.http({
    method: 'post',
    url: '/reset-password',
    body: data,
  });

export const userSendOtpRequest = async (data) =>
  await Api.http({
    method: 'post',
    url: '/check-otp',
    body: data,
  });
