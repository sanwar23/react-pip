import ServiceBase from '../../../common/serviceBase'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService } from '../../helper'
import { deleteCourseById, deleteRequiredCourses } from '../../helper/people'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  course_id: {
    presence: { allowEmpty: false }
  }
}

export class PeopleDeleteCourseService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { course_id, user_id } = this.filteredArgs

      const isDeleted = await deleteCourseById({ course_id, user_id })

      await deleteRequiredCourses({ course_id })

      if (!isDeleted) {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.COURSE_NOT_FOUND)
      }

      return isDeleted
    } catch (e) {
      logger.error(getErrorMessageForService('PeopleDeleteCourseService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
