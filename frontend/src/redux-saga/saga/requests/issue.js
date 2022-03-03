import apiClient from '../../../utils/apiClient';

class IssueService {
  static async postNewIssue(issueData) {
    console.log(issueData);

    const response = await apiClient.postRequest(`/task`, issueData);
    return response;
  }
}

export default IssueService;
