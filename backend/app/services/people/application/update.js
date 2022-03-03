import ServiceBase from '../../../common/serviceBase'
import { getErrorMessageForService } from '../../helper'
import Logger from '../../../common/logger'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import { updateJobApplicationById, fetchJobApplicationById, getUserIdByJobId } from '../../helper/jobApplication'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  data: {
    presence: { allowEmpty: false }
  },
  application_id: {
    presence: false
  }
}

export class PeopleUpdateJobApplicationService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { application_id, data } = this.filteredArgs
    try {
      const jobApplication = await updateJobApplicationById({ application_id, ...data })

      if (jobApplication && jobApplication[0] < 1) {
        return this.addError(ERRORS.BAD_DATA, MESSAGES.JOB_APPLICATION_NOT_UPDATED)
      }

      let updatedApplication = await fetchJobApplicationById({ application_id })

      if (updatedApplication && ['screening', 'resigned'].includes(updatedApplication.status)) {
        const clientUserId = await getUserIdByJobId({ job_id: data && data.jobId })

        updatedApplication = {
          ...updatedApplication,
          client_user_id: clientUserId
        }
      }

      return updatedApplication
    } catch (err) {
      Logger.error(`${getErrorMessageForService('PeopleUpdateJobApplicationService')} ${err}`)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
