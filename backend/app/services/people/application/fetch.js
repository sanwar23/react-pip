import ServiceBase from '../../../common/serviceBase'
import { getErrorMessageForService } from '../../helper'
import Logger from '../../../common/logger'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import { fetchJobApplicationByQuery } from '../../helper/jobApplication'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  applicationId: {
    presence: false
  },
  jobId: {
    presence: false
  },
  agentUserId: {
    presence: false
  },
  clientId: {
    presence: false
  },
  testApplicationExist: {
    presence: false
  }
}

export class PeopleFetchJobApplicationService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { applicationId, jobId, agentUserId, clientId, testApplicationExist } = this.filteredArgs
    try {
      const jobApplication = await fetchJobApplicationByQuery({ applicationId, jobId, clientId, agentUserId })
      if (!jobApplication) {
        if (testApplicationExist) {
          return {}
        } else {
          return this.addError(ERRORS.NOT_FOUND, MESSAGES.JOB_APPLICATION_NOT_EXIST)
        }
      }

      return jobApplication
    } catch (err) {
      Logger.error(getErrorMessageForService('PeopleFetchJobApplicationService'), err)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
