import ServiceBase from '../../../../common/serviceBase'
import { ERRORS } from '../../../../utils/errors'
import logger from '../../../../common/logger'
import { getErrorMessageForService, updateJob, getClientData, getClientIdByUserId } from '../../../helper'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  job_id: {
    presence: { allowEmpty: false }
  },
  category_id: {
    presence: { allowEmpty: false }
  },
  title: {
    presence: { allowEmpty: false }
  },
  job_type: {
    presence: { allowEmpty: true }
  },
  duration_months: {
    presence: { allowEmpty: true }
  },
  duration_type: {
    presence: { allowEmpty: true }
  },
  experience_type: {
    presence: { allowEmpty: true }
  },
  description: {
    presence: { allowEmpty: true }
  },
  needed: {
    presence: { allowEmpty: true }
  },
  required_courses: {
    presence: { allowEmpty: true }
  },
  bonus_courses: {
    presence: { allowEmpty: true }
  },
  required_skills: {
    presence: { allowEmpty: true }
  },
  bonus_skills: {
    presence: { allowEmpty: true }
  },
  pay_amount: {
    presence: { allowEmpty: true }
  },
  languages: {
    presence: { allowEmpty: true }
  },
  status: {
    presence: { allowEmpty: true }
  }
}

export class UpdateJobService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id, ...payload } = this.filteredArgs
      const { client_id } = await getClientIdByUserId({ user_id: this.user_id })
      const { city, state } = await getClientData({ client_id })
      const updatedJob = await updateJob({ client_id, user_id, city, state, ...payload })
      return updatedJob
    } catch (err) {
      logger.error(`${getErrorMessageForService('UpdateJobService')} ${err}`)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
