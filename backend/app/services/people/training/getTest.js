import ServiceBase from '../../../common/serviceBase'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService } from '../../helper'
import { fetchTestDetails, formatTestQuestionsData } from '../../helper/people'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  course_id: {
    presence: { allowEmpty: false }
  },
  sectionId: {
    presence: { allowEmpty: false }
  }
}

export class PeopleGetTestService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { sectionId: section_id } = this.filteredArgs

      const questions = await fetchTestDetails({ section_id })

      if (questions && questions.length) {
        const testDetails = formatTestQuestionsData({ questions })
        return testDetails
      } else {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.DATA_NOT_FOUND)
      }
    } catch (e) {
      logger.error(getErrorMessageForService('PeopleGetTestService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
