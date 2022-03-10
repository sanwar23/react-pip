import Responder from '../../server/expressResponder';
import { AddNewIssue, ListIssue } from '../services/task/';

export default class TaskController {
  static async createNewTask(req, res) {
    const issue = await AddNewIssue.execute({
      ...req.body,
      ...req.query,
    });

    if (issue.result) {
      Responder.success(res, issue.result);
    } else {
      Responder.failed(res, issue.errors);
    }
  }

  static async getAllTask(req, res) {
    const issue = await ListIssue.execute({
      ...req.body,
      ...req.query,
    });

    if (issue.result) {
      Responder.success(res, issue.result);
    } else {
      Responder.failed(res, issue.errors);
    }
  }
}
