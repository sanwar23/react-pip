import ServiceBase from '../../../common/serviceBase'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService } from '../../helper'
import { checkAuthenticUser, updateTestEntry } from '../../helper/people'

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
  validated_data: {
    presence: { allowEmpty: false }
  }
}

export class PeopleUpdateTestEntryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id, course_id, validated_data } = this.filteredArgs

      const isAuthenticUser = await checkAuthenticUser({ user_id, course_id })

      if (isAuthenticUser) {
        await updateTestEntry({ validatedData: validated_data })
      } else {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.UNAUTHORIZED)
      }
    } catch (e) {
      logger.error(getErrorMessageForService('PeopleUpdateTestEntryService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
