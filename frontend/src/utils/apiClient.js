import axios from 'axios';
import configEnv from './config';
import { handleResponse, handleReponseError } from './interceptors';
import Cookies from 'js-cookie';

const baseURL = configEnv.NODE_BASE_URL;

class ApiClient {
  constructor(axiosInst) {
    this.axios = axiosInst;
  }

  makeRequest = (url, method, data = {}, params) =>
    this.axios({
      url,
      method,
      data,
      params,
    });

  getRequest = async (url, config, params) =>
    this.makeRequest(url, 'GET', config, params);

  putRequest = (url, config) => this.makeRequest(url, 'put', config);

  postRequest = async (url, config) => this.makeRequest(url, 'post', config);

  deleteRequest = (url, config) => this.makeRequest(url, 'delete', config);
}

const axiosInst = axios.create({
  baseURL,
});

axiosInst.defaults.withCredentials = true;
axiosInst.defaults.headers.common['Authorization'] =
  'Basic ' + Cookies.get('access_token');
axiosInst.interceptors.response.use(handleResponse, handleReponseError);

export { axiosInst };

export default new ApiClient(axiosInst);
