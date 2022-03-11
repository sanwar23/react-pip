import {
  postNewIssue,
  getListIssue,
  getIssue,
  putIssue,
} from '../requests/issue';
import { put, call } from 'redux-saga/effects';
import { submitIssue, setIssues, setIssue } from '../../actions';

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
  } catch (error) {
    console.log(error);
  }
}

export function* handleGetIssue(action) {
  console.log(action.payload);
  try {
    const response = yield getIssue(action.payload);
    console.log('get list issue');
    console.log(response.data.data);

    yield put(setIssue({ data: response.data.data }));
    if (response.status == 200) {
    }
  } catch (error) {}
}

export function* handleUpdateIssue(action) {
  try {
    console.log('put issue');
    console.log(action.payload);
    const response = yield putIssue(action.payload);

    // if (response.status == 200) {
    //   yield put(submitIssue({ data: response.message, status: 'success' }));
    // }
  } catch (error) {
    console.log(error);
    yield put(submitIssue({ data: 'error', status: 'error' }));
  }
}
