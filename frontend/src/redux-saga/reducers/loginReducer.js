const initialState = {
  username: '',
  password: '',
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'login_user':
      return {
        username: action.payload.username,
        password: action.payload.password,
      };

    default:
      return state;
  }
};
export default loginReducer;
