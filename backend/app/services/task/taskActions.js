import Request from '../../../lib/request';
import config from '../../../config/app';

class TaskActions {
  constructor() {
    const url = config.get('gitlab.gitlabURL');
    const headers = {
      Authorization: `Bearer ${config.get('gitlab.gitlabToken')}`,
    };

    this.client = new Request(url, headers);
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
    console.log('---------- task action in');

    const promises = group.map((groupId) => {
      return () => this.client.post(`/projects/${groupId}/issues`, body);
      /* axios({
           url: `${url}/projects/${groupId}/issues`,
           method: 'post',
           data: reqData,
           headers: headers,
         }); */
    });
    return promises;
    // const responseArray = await Promise.all(
    //   promises.map((promise) => promise())
    // );
    // console.log('))))))))))-----------)))))))))', responseArray.statusCode);

    /*   let resultArr = [];
    let arr = Promise.all(
      group.map((grp) => {
        const result = this.client.post(`/projects/${grp}/issues`, body);
        console.log('---------- task action in loop');

        console.log('result----', result);
        // resultArr.push(result);
        // console.log('result----', result);
        // return result;
        // return Promise.all([result])
        //   .then((values) => {
        //     console.log('promis--all--------', values);
        //     return values;
        //     // resultArr.push(values);
        //   })
        //   .catch((res) => {
        //     console.log('promis--error -------', res);
        //     return res;
        //     // resultArr.push(res);
        //   });

        // console.log(resultArr);

        // console.log('arrrr----', arr);
      })
    )
      .then((values) => {
        console.log('promis--all--------', values);
        return values;
        // resultArr.push(values);
      })
      .catch((res) => {
        console.log('promis--error -------', res);
        return res;
        // resultArr.push(res);
      });
    console.log('---------- task action in end', arr); */
    // return arr;
    // return resultArr;
    // const result = await this.client.post(`/projects/${group}/issues`, body);
    // console.log('result----', result);
    // return result;
  }
}

module.exports = new TaskActions();
