import ServiceBase from '../../../common/serviceBase'
import { getErrorMessageForService, getOne } from '../../helper'
import Logger from '../../../common/logger'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import { createJobApplication } from '../../helper/jobApplication'
import { XQodApplication } from '../../../db/models'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  data: {
    presence: { allowEmpty: false }
  }
}

export class PeopleCreateJobApplicationService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { data } = this.filteredArgs
    try {
      const checkJobApplication = await getOne({
        model: XQodApplication,
        data: {
          user_id: data.agentUserId,
          client_id: data.clientId,
          job_id: data.jobId
        }
      })
      if (checkJobApplication && checkJobApplication.status === 'invited') {
        this.addError(ERRORS.BAD_DATA, MESSAGES.AGENT_ALREADY_INVITED)
        return
      }
      if (checkJobApplication && checkJobApplication.status === 'applied') {
        this.addError(ERRORS.BAD_DATA, MESSAGES.JOB_ALREADY_APPLIED)
        return
      }
      const jobApplication = await createJobApplication(data)
      // WIP - send notification
      return jobApplication
    } catch (err) {
      Logger.error(`${getErrorMessageForService('PeopleCreateJobApplicationService')} ${err}`)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
