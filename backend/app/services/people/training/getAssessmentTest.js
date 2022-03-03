import ServiceBase from '../../../common/serviceBase'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService } from '../../helper'
import { fetchAssessmentTestDetails, getRandomQuestions } from '../../helper/people'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  course_id: {
    presence: { allowEmpty: false }
  }
}

export class PeopleGetAssessmentTestService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { course_id } = this.filteredArgs

      const questions = await fetchAssessmentTestDetails({ course_id })

      if (questions) {
        const testDetails = getRandomQuestions({ questions })
        return testDetails
      } else {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.DATA_NOT_FOUND)
      }
    } catch (e) {
      logger.error(getErrorMessageForService('PeopleGetAssessmentTestService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
