import { combineReducers } from 'redux';
import issueReducer from './issueReducer';
import loginReducer from './loginReducer';
import { connectRouter } from 'connected-react-router';

const rootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    issues: issueReducer,
    user: loginReducer,
  });

export default rootReducer;
