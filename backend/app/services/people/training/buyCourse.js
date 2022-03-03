import ServiceBase from '../../../common/serviceBase'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService } from '../../helper'
import {
  getOnlyCourseById, enrollUserToCourse
  , getViewCourseById, getUserCourseByCourseId
} from '../../helper/people'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  course_id: {
    presence: { allowEmpty: false }
  }
}

export class PeopleBuyCourseService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { course_id, user_id } = this.filteredArgs

      const course = await getOnlyCourseById({ course_id })
      if (course) {
        const userCourse = await getUserCourseByCourseId({ course_id, user_id })

        // check if user is already enrolled in this course
        if (userCourse) {
          return this.addError(ERRORS.BAD_REQUEST, MESSAGES.USER_ALREADY_ENROLLED)
        }
        // Enroll user to course
        const enrollResult = await enrollUserToCourse({ user_id, course })
        if (enrollResult) {
          const updatedCourse = await getViewCourseById({ course_id, user_id })
          return updatedCourse
        }
      } else {
        return this.addError(ERRORS.NOT_FOUND, MESSAGES.COURSE_NOT_FOUND)
      }
    } catch (e) {
      logger.error(getErrorMessageForService('PeopleBuyCourseService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
