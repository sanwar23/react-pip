import apiClient from '../../../utils/apiClient';

export const postNewIssue = (issueData) =>
  apiClient.postRequest(`/task`, issueData);
