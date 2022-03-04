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
};

export class AddNewIssue extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    try {
      const issueParam = this.filteredArgs;
      console.log('---------- create js in');
      const issueData = await TaskAction.addIssue(issueParam);
      console.log('========', issueData);
      return issueData;

      /* const issueData1 = await Promise.all(
        issueData.map((promise) => promise())
      ); */
      // console.log('*****************', issueData1);
      /* console.log('---------- create js out');
      console.log('eswwwrror------------', issueData);

      if (issueData !== null) {
        logger.info('Issue data is added successfully');
        return issueData.body;
      }
      return `Issue data is added successfully`; */
    } catch (err) {
      console.log('eaaarror------------', err);
      // logger.error(err);
      // return false;
    }
  }
}
