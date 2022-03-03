import ServiceBase from '../../../common/serviceBase'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService } from '../../helper'
import { checkAuthenticUser, fetchTestEntry, formatTestEntryData } from '../../helper/people'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  course_id: {
    presence: { allowEmpty: false }
  },
  candidate_id: {
    presence: { allowEmpty: false }
  },
  test_type: {
    presence: { allowEmpty: false }
  }
}

export class PeopleGetTestEntryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id, course_id, candidate_id, test_type } = this.filteredArgs

      const isAuthenticUser = await checkAuthenticUser({ user_id, course_id })

      if (isAuthenticUser) {
        const testEntry = await fetchTestEntry({ course_id, user_id: candidate_id, test_type })

        if (testEntry && testEntry.length) {
          const formattedData = formatTestEntryData({ testEntry })
          return formattedData
        } else {
          this.addError(ERRORS.NOT_FOUND, MESSAGES.DATA_NOT_FOUND)
        }
      } else {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.UNAUTHORIZED)
      }
    } catch (e) {
      logger.error(getErrorMessageForService('PeopleGetTestEntryService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
