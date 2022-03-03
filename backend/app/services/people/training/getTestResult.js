import ServiceBase from '../../../common/serviceBase'
import { ERRORS } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService } from '../../helper'
import {
  checkTestEvaluation, fetchTestDetails, getUsetTestAnswers, formatTestResultData
} from '../../helper/people'

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

export class PeopleGetTestResultService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id, course_id, sectionId: section_id } = this.filteredArgs

      const isTestEvaluated = await checkTestEvaluation({ user_id, course_id, section_id })

      if (isTestEvaluated) {
        const promiseArray = [
          () => fetchTestDetails({ section_id }),
          () => getUsetTestAnswers({ user_id, course_id, section_id })
        ]

        const [questions, userTestAnswers] = await Promise.all(promiseArray.map(promise => promise()))

        if (questions && userTestAnswers && questions.length) {
          return {
            isTestEvaluated,
            testResult: formatTestResultData({ questions, userTestAnswers })
          }
        }
      }

      return {
        isTestEvaluated: false,
        testResult: {}
      }
    } catch (e) {
      logger.error(getErrorMessageForService('PeopleGetTestResultService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
