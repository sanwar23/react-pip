export const loginUser = (params) => {
  return {
    type: 'login_user',
    payload: params,
  };
};
