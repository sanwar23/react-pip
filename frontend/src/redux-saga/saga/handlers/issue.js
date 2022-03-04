import { postNewIssue } from '../requests/issue';
import { put, call } from 'redux-saga/effects';
import { submitIssue } from '../../actions';

export function* handleSetIssue(action) {
  try {
    const response = yield postNewIssue(action.payload);

    if (response.status == 200) {
      yield put(submitIssue({ data: response.data, status: 'success' }));
    }
  } catch (error) {
    console.log(error);
    yield put(submitIssue({ data: 'error', status: 'error' }));
  }
}
/* 
export function* handleSubmitIssue(action) {
  try {
    console.log('in submit issue');
    console.log(action);

    // const { data } = response;
    // yield put(setPost(data));
  } catch (error) {
    console.log(error);
  }
}
 */
