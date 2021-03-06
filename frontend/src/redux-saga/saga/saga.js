import { takeLatest } from '@redux-saga/core/effects';
import {
  handleSetIssue,
  handleSubmitIssue,
  handleListIssue,
  handleGetIssue,
  handleUpdateIssue,
} from './handlers/issue';
import { handleLogin } from './handlers/login';

function* rootSaga() {
  yield takeLatest('get_issue', handleGetIssue);
  yield takeLatest('list_issues', handleListIssue);
  yield takeLatest('add_issue', handleSetIssue);
  yield takeLatest('update_issue', handleUpdateIssue);
  yield takeLatest('login_user', handleLogin);
}

export default rootSaga;
