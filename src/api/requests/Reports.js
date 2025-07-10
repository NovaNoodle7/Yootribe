import Api from '../Api';

/**
 * Only admin users can access this endpoint
 * @returns All Reports
 */
export const getReports = async () =>
  await Api.http({
    method: 'get',
    url: '/reports/all',
  });

/**
 * 
 * @param {*} data 
 * @returns All Reports + new Report
 */
export const storeReport = async (data) =>
  await Api.http({
    method: 'post',
    url: '/reports/store',
    body: data,
  });

/**
 * Only admin users can access this endpoint
 * @returns All Reports
 */
export const deleteReport = async (id) =>
  await Api.http({
    method: 'delete',
    url: `/reports/delete/${id}`,
  });
