import ServiceBase from '../../../common/serviceBase'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService } from '../../helper'
import { updateUserCourseInfo } from '../../helper/people'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  course_id: {
    presence: { allowEmpty: false }
  }
}

export class PeopleStartCourseService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { course_id, user_id } = this.filteredArgs

      const courseDetails = await updateUserCourseInfo({ course_id, user_id })
      if (courseDetails) {
        return courseDetails
      } else {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.COURSE_NOT_FOUND)
      }
    } catch (e) {
      logger.error(getErrorMessageForService('PeopleStartCourseService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
