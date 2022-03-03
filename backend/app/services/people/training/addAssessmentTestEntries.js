import ServiceBase from '../../../common/serviceBase'
import { ERRORS } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService } from '../../helper'
import { addTestEntries, updateCourseStatus } from '../../helper/people'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  course_id: {
    presence: { allowEmpty: false }
  },
  questions: {
    presence: { allowEmpty: false }
  }
}

export class PeopleAddAssessmentTestEntriesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id, course_id, questions } = this.filteredArgs

      const sectionIds = questions && questions.map((item) => item.sectionId)

      await addTestEntries({ user_id, course_id, sectionIds, questions, testType: 'assessment' })

      await updateCourseStatus({ user_id, course_id })
    } catch (e) {
      logger.error(getErrorMessageForService('PeopleAddAssessmentTestEntriesService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
