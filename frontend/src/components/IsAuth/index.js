import React, { useEffect } from 'react';
// import { useTypedSelector } from 'src/hooks'
// import useActions from 'src/store/common/useActions'

import Cookies from 'js-cookie';
import { Redirect } from 'react-router-dom';

const IsAuth = ({ children }) => {
  return Cookies.get('access_token') ? children : <Redirect to="/login" />;
};

export { IsAuth };
