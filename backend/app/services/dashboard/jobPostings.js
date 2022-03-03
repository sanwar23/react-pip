import ServiceBase from '../../common/serviceBase'
import { getRecentJobsByClient } from '../helper/job'
import { getClientIdByUserId } from '../helper/user'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  }
}

export class JobPostings extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { client_id } = await getClientIdByUserId({ userId: this.user_id })
    const recentJobs = await getRecentJobsByClient({ client_id })
    return recentJobs
  }
}
