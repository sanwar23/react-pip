import Responder from '../../server/expressResponder';

import { AddNewIssue } from '../services/task/';

export default class TaskController {
  static async getAllTask(req, res) {
    console.log('constoller --------  start');
    const issue = await AddNewIssue.execute({
      ...req.body,
      ...req.query,
    });
    console.log('constoller --------  end', issue);
    // console.log('issuee----------', issue);
    if (issue.result.project_id) {
      res.status(200).json({
        message: issue.result.project_id,
        // message: 'Issue added successfull',
      });
    } else {
      res.status(401).json({ message: 'Issue adding failed' });
    }
    /* if (issue.successful) {
      Responder.success(res, issue.result);
    } else {
      Responder.failed(res, issue.errors);
    } */
  }
}
