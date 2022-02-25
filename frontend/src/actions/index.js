export const issueAdd = (params) => {
  return {
    type: "add_issue",
    payload: params,
  };
};
