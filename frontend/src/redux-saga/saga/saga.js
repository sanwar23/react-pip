import { takeLatest } from '@redux-saga/core/effects';
import { handleSetIssue, handleSubmitIssue } from './handlers/issue';
import { handleLogin } from './handlers/login';

function* rootSaga() {
  yield takeLatest('submit_issue', handleSubmitIssue);
  yield takeLatest('add_issue', handleSetIssue);
  yield takeLatest('login_user', handleLogin);
}

export default rootSaga;
