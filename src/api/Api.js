import axios from 'axios';

export const ApiAxios = axios.create();
ApiAxios.defaults.baseURL = process.env.REACT_APP_API;
ApiAxios.defaults.headers.common['Content-Type'] = 'application/json';

ApiAxios.interceptors.request.use((req) => {
  const userToken = localStorage.getItem('token');
  if (userToken) {
    req.headers.Authorization = `Bearer ${userToken}`;
  }

  return req;
});

class ApiService {
  /**
   * @param {Object} options
   * @param {String} options.url
   * @param {String} options.query url parameters
   * @param {String} options.method
   * @param {Object.<string, *>} options.body
   * @param {Object.<string, *>} options.headers
   * @returns
   */
  http = (options) => {
    const { url, method, body, query } = options;
    const headers = {};

    return new Promise((resolve, reject) => {
      ApiAxios.request({
        url,
        method,
        data: body,
        headers: {
          ...headers,
          ...options.headers
        },
        params: query
      })
        .then((res) => resolve(res?.data))
        .catch((error) => reject(error?.response?.data || error));
    });
  };
}

const Api = new ApiService();

export default Api;
