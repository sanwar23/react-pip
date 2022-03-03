export const issueAdd = (params) => {
  return {
    type: 'add_issue',
    payload: params,
  };
};

export const submitIssue = (params) => {
  console.log(params);
  return {
    type: 'submit_issue',
    payload: params,
  };
};
