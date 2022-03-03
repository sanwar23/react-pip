import ServiceBase from '../../../common/serviceBase'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService } from '../../helper'
import { getViewCourseById, checkIsCourseCreator, getCreatorViewCourseById } from '../../helper/people'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  course_id: {
    presence: { allowEmpty: false }
  }
}

export class PeopleGetViewCourseService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { course_id, user_id } = this.filteredArgs
      let course

      const isCreator = await checkIsCourseCreator({ course_id, user_id })

      if (isCreator) {
        course = await getCreatorViewCourseById({ course_id, user_id })
      } else {
        course = await getViewCourseById({ course_id, user_id })
      }

      if (course) {
        return course
      } else {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.COURSE_NOT_FOUND)
      }
    } catch (e) {
      logger.error(getErrorMessageForService('PeopleGetViewCourseService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
