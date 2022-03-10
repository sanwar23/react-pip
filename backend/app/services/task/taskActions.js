import Request from '../../../lib/request';
import config from '../../../config/app';
import apiClient from '../../utils/apiClient';
import { result } from 'validate.js';

class TaskActions {
  constructor() {
    this.axiosRequest = new apiClient();
  }

  async addIssue({
    title,
    group,
    type,
    description,
    assignee,
    label,
    milestone,
  }) {
    const body = {
      title,
      type,
      description,
      assignee,
      label,
      milestone,
    };

    const promises = group.map((groupId) => {
      return () => this.createIssue(groupId, body);
    });

    const response = await Promise.all(promises.map((promise) => promise()));
    const successIds = [];
    const errorIds = [];

    let message = '';

    response.map((res) => {
      if (res.success) {
        successIds.push(res.success);
      } else if (res.error) {
        errorIds.push(res.error);
      }
    });

    const data = {
      success_ids: successIds,
      error_ids: errorIds,
    };

    if (successIds.length > 0)
      message += ` Issues inserted - ${successIds.join(', ')}. `;

    if (errorIds.length > 0)
      message += ` Issues not inserted - ${errorIds.join(', ')}.`;

    return message;
  }

  async createIssue(groupId, body) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.axiosRequest.postRequest(
          `/projects/${groupId}/issues`,
          body
        );
        resolve({ success: groupId });
      } catch (err) {
        resolve({ error: groupId });
      }
    });
  }

  async listIssue(params) {
    let url = `/issues?page=${params.page}`;

    if (params.project_id && params.issue_id) {
      url = `/projects/${params.project_id}/issues?page=${params.page}&iids[]=${params.issue_id}`;
    } else if (params.project_id) {
      url = `/projects/${params.project_id}/issues?page=${params.page}`;
    }
    const response = await this.axiosRequest.getRequest(url);

    const resData = {
      data: response.data,
      page: {
        current_page: response.headers['x-page'],
        next_page: response.headers['x-next-page'],
        prev_page: response.headers['x-prev-page'],
        per_page: response.headers['x-per-page'],
        total: response.headers['x-total'],
        total_pages: response.headers['x-total-pages'],
        current_page: response.headers['x-prev-page'],
      },
    };

    return resData;
  }
}

module.exports = new TaskActions();
