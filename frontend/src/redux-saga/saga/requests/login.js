import apiClient from '../../../utils/apiClient';

class loginService {
  static async postLogin(loginData) {
    console.log(loginData);

    const response = await apiClient.postRequest(`/user/login`, loginData);
    return response;
  }
}

export default loginService;
