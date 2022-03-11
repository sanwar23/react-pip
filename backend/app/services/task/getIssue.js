import ServiceBase from '../../common/serviceBase';
import TaskAction from './taskActions';
import logger from '../../common/logger';

const constraints = {
  project_id: {
    presence: { allowEmpty: false },
  },
  issue_id: {
    presence: { allowEmpty: false },
  },
};

export class GetIssue extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    try {
      const issueParam = this.filteredArgs;

      const issueData = await TaskAction.getIssue(issueParam);

      return issueData;
    } catch (err) {
      console.log(err);
    }
  }
}
