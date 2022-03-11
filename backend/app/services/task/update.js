import ServiceBase from '../../common/serviceBase';
import TaskAction from './taskActions';
import logger from '../../common/logger';

const constraints = {
  title: {
    presence: { allowEmpty: false },
  },
  group: {
    presence: { allowEmpty: true },
  },
  description: {
    presence: { allowEmpty: true },
  },
  assignee: {
    presence: { allowEmpty: true },
  },
  label: {
    presence: { allowEmpty: true },
  },
  milestone: {
    presence: { allowEmpty: true },
  },
  type: {
    presence: { allowEmpty: true },
  },
  project_id: {
    presence: { allowEmpty: false },
  },
  issue_id: {
    presence: { allowEmpty: false },
  },
};

export class UpdateIssue extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    try {
      const issueParam = this.filteredArgs;
      const issueData = await TaskAction.updateIssue(issueParam);

      return issueData;
    } catch (err) {
      console.log(err);
    }
  }
}
