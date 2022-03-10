import { postNewIssue, getListIssue } from '../requests/issue';
import { put, call } from 'redux-saga/effects';
import { submitIssue, setIssues } from '../../actions';

export function* handleSetIssue(action) {
  try {
    const response = yield postNewIssue(action.payload);

    if (response.status == 200) {
      yield put(submitIssue({ data: response.message, status: 'success' }));
    }
  } catch (error) {
    console.log(error);
    yield put(submitIssue({ data: 'error', status: 'error' }));
  }
}

export function* handleListIssue(action) {
  console.log(action.payload);
  try {
    const response = yield getListIssue(action.payload);
    console.log('in list issue');
    console.log(response.data);
    yield put(setIssues({ data: response.data }));
    if (response.status == 200) {
      // yield put(submitIssue({ data: response.message, status: 'success' }));
    }
  } catch (error) {
    console.log(error);
    // yield put(submitIssue({ data: 'error', status: 'error' }));
  }
}
