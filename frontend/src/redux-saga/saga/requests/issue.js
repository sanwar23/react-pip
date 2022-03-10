import apiClient from '../../../utils/apiClient';

export const postNewIssue = (issueData) =>
  apiClient.postRequest(`/task/create`, issueData);

export const getListIssue = (issueData) => {
  console.log(issueData);
  return apiClient.getRequest(`/task/list`, {}, issueData);
};
