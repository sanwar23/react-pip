import loginService from '../requests/login';

export function* handleLogin(action) {
  try {
    const payload = {
      username: action.payload.username,
      password: action.payload.password,
    };

    const response = yield loginService.postLogin(payload);

    if (response.status == 200) {
      window.location.href = '/create-task';
    }
  } catch (error) {
    console.log(error);
  }
}
