import { requestGetPost } from "../requests/issue";
import { call, put } from "redux-saga/effects";

export function* handleSetIssue() {
  try {
    console.log("in");
  } catch (error) {
    console.log(error);
  }
}
