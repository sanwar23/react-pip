import ServiceBase from '../../../../common/serviceBase'
import { ERRORS, MESSAGES } from '../../../../utils/errors'
import logger from '../../../../common/logger'
import { deleteJob, getErrorMessageForService, getJobById } from '../../../helper'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  job_id: {
    presence: { allowEmpty: false }
  }
}

export class DeleteJobService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id, job_id } = this.filteredArgs
      const jobsData = await getJobById({ job_id })
      if (jobsData) {
        if (jobsData.user_id === user_id) {
          await deleteJob({ job_id: jobsData.job_id })
          return {
            job_id: jobsData.job_id
          }
        } else {
          this.addError(ERRORS.UNAUTHORIZED)
          return
        }
      } else {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.JOB_NOT_EXIST)
        return
      }
    } catch (err) {
      logger.error(`${getErrorMessageForService('DeleteJobService')} ${err}`)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
