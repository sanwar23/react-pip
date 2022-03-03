import ServiceBase from '../../../common/serviceBase'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService } from '../../helper'
import { updateUserUnitDetails, fetchUnitDetails } from '../../helper/people'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  course_id: {
    presence: { allowEmpty: false }
  },
  status: {
    presence: { allowEmpty: false }
  },
  unitId: {
    presence: { allowEmpty: false }
  }
}

export class PeopleGetUnitService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { course_id, user_id, status, unitId: unit_id } = this.filteredArgs

      await updateUserUnitDetails({ course_id, user_id, status, unit_id })

      const unitDetails = await fetchUnitDetails({ unit_id, status })

      if (unitDetails) {
        return unitDetails
      } else {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.DATA_NOT_FOUND)
      }
    } catch (e) {
      logger.error(getErrorMessageForService('PeopleGetUnitService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
