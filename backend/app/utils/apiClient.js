import axios from 'axios';
import configEnv from './config';
import { handleResponse, handleReponseError } from './interceptors';

const baseURL = configEnv.NODE_BASE_URL;

class ApiClient {
  constructor(axiosInst) {
    this.axios = axiosInst;
  }

  makeRequest = async (url, method, data = {}, params) =>
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

  signup = (body) => this.postRequest('/user/signup', body);

  emailVerification = async (token) => {
    const response = await this.getRequest(`/auth/verify-token/${token}`);
    return response;
  };

  postSignUp = (userType, step, body) =>
    this.postRequest(`/${userType}/post-signup/step${step}`, body);

  inviteRequest = (methodType, { type, body }) =>
    this.makeRequest(`/user/${type}`, methodType, body);

  login = async (body) => {
    const { status } = await this.axios({
      url: '/user/login',
      method: 'post',
      data: body,
      withCredentials: true,
    });
    return status;
  };

  getUser = async () => {
    const user = await this.axios({
      url: '/user/profile',
      method: 'get',
    });
    return user;
  };

  searchUsers = async ({ searchString, offset }) => {
    const response = await this.axios({
      url: `user/search?search_string=${searchString}&offset=${offset}`,
      method: 'get',
    });

    return response;
  };
}

const axiosInst = axios.create({
  baseURL,
});
axiosInst.defaults.withCredentials = true;
axiosInst.interceptors.response.use(handleResponse, handleReponseError);

export { axiosInst };

export default new ApiClient(axiosInst);
