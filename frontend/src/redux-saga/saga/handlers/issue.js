import IssueService from '../requests/issue';
import { select, put, call, all } from 'redux-saga/effects';
import { submitIssue } from '../../actions';

export function* handleSetIssue(action) {
  try {
    const groups = action.payload.group;

    // yield put(submitIssue('7897899'));
    yield all(
      groups.map((grp) => {
        action.payload.group = grp;
        console.log(action.payload);
        const response = IssueService.postNewIssue(action.payload);

        Promise.all([response])
          .then((data) => {
            console.log('promis--all--------', data[0].message);
          })
          .catch((res) => {
            console.log('promis--error -------', res);
          });
      })
    );
  } catch (error) {
    console.log(error);
  }
}

const data = (d) => {
  call(submitIssue('7897899'));
  console.log(d);
};

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
