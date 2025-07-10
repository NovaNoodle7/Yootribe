import Api from "../Api";

/**
 * Only admin users can access this endpoint
 * @returns array of users
 */
export const getAllKYB = async () =>
  await Api.http({
    method: 'get',
    url: '/kyb/all',
  });

export const getUserKYB = async () =>
  await Api.http({
    method: 'get',
    url: '/kyb',
  });

export const storeKYB = async (data) =>
  await Api.http({
    method: 'post',
    url: '/kyb',
    body: data
  });

export const kybApproval = async (id, data) =>
  await Api.http({
    method: 'post',
    url: `/kyb/approval/${id}`,
    body: data
  });