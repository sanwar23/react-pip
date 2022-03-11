export const issueAdd = (params) => {
  return {
    type: 'add_issue',
    payload: params,
  };
};

export const issueUpdate = (params) => {
  return {
    type: 'update_issue',
    payload: params,
  };
};

export const submitIssue = (params) => {
  return {
    type: 'submit_issue',
    payload: params,
  };
};

export const listIssues = (params) => {
  console.log(params);
  return {
    type: 'list_issues',
    payload: params,
  };
};

export const getIssue = (params) => {
  console.log(params);
  return {
    type: 'get_issue',
    payload: params,
  };
};

export const setIssues = (params) => {
  return {
    type: 'set_issues',
    payload: params,
  };
};

export const setIssue = (params) => {
  console.log(params);
  return {
    type: 'set_issue',
    payload: params,
  };
};

export const clearIssue = (params) => {
  return {
    type: 'clear_issue',
    payload: params,
  };
};
