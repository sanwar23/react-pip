import { takeLatest } from '@redux-saga/core/effects';
import {
  handleSetIssue,
  handleSubmitIssue,
  handleListIssue,
} from './handlers/issue';
import { handleLogin } from './handlers/login';

function* rootSaga() {
  yield takeLatest('list_issues', handleListIssue);
  yield takeLatest('add_issue', handleSetIssue);
  yield takeLatest('login_user', handleLogin);
}

export default rootSaga;
