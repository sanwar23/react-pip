import axios from 'axios';
import config from '../../config/app';
import { handleResponse, handleReponseError } from './interceptors';

const baseURL = config.get('gitlab.gitlabURL');

class ApiClient {
  constructor() {
    const axiosInst = axios.create({
      baseURL,
    });

    axiosInst.defaults.headers.common['Authorization'] = `Bearer ${config.get(
      'gitlab.gitlabToken'
    )}`;
    axiosInst.defaults.withCredentials = true;
    axiosInst.interceptors.response.use(handleResponse, handleReponseError);
    this.axios = axiosInst;
  }

  makeRequest(url, method, data = {}, params) {
    return this.axios({
      url,
      method,
      data,
      params,
    });
  }

  postRequest(url, data) {
    return this.makeRequest(url, 'post', data);
  }

  getRequest(url, config, params) {
    return this.makeRequest(url, 'GET', config, params);
  }

  putRequest = (url, config) => this.makeRequest(url, 'put', config);

  /*


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
  };*/
}
/*
const axiosInst = axios.create({
  baseURL,
});

axiosInst.defaults.headers.common['Authorization'] = `Bearer ${config.get(
  'gitlab.gitlabToken'
)}`;
axiosInst.defaults.withCredentials = true;
axiosInst.interceptors.response.use(handleResponse, handleReponseError);

export { axiosInst };

export default new ApiClient(axiosInst);*/
module.exports = ApiClient;
