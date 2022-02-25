import { takeLatest } from "@redux-saga/core/effects";
import { handleSetIssue } from "./handlers/issue";

function* rootSaga() {
  yield takeLatest("add_issue", handleSetIssue);
}

export default rootSaga;
