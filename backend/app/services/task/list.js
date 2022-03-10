import ServiceBase from '../../common/serviceBase';
import TaskAction from './taskActions';
import logger from '../../common/logger';

const constraints = {
  page: {
    presence: { allowEmpty: true },
  },
};

export class ListIssue extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    try {
      const issueParam = this.filteredArgs;

      const issueData = await TaskAction.listIssue(issueParam);

      return issueData;
    } catch (err) {
      console.log(err);
    }
  }
}
