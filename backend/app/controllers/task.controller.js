import Responder from '../../server/expressResponder';

import { AddNewIssue } from '../services/task/';

export default class TaskController {
  static async getAllTask(req, res) {
    let resultArr = [];
    const issue = await AddNewIssue.execute({
      ...req.body,
      ...req.query,
    });
    console.log('constoller --------  end', issue.result);
    if (issue.result) {
      const responseArray = await Promise.all(
        issue.result.map((promise) => promise())
      );

      responseArray.map((res) => {
        // console.log(res);
        resultArr.push(res.body.project_id);
      });
      // console.log(res.statusCode);
      // console.log('11111111111111', resultArr);

      // console.log('issuee----------', issue);
      if (resultArr) {
        res.status(200).json({
          data: resultArr,
          message: 'Issue added successfull',
        });
      } else {
        res.status(401).json({ message: 'Issue adding failed' });
      }
    }
    /* if (issue.successful) {
        Responder.success(res, issue.result);
      } else {
        Responder.failed(res, issue.errors);
    } */
  }
}
