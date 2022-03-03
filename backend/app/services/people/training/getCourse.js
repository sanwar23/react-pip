import ServiceBase from '../../../common/serviceBase'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService } from '../../helper'
import {
  findStudentsEnrolledCount, getCourseById, formatCourseData, getCategoryTitleById, getRequiredCoursesById,
  getRequiredCoursesData
} from '../../helper/people'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  course_id: {
    presence: { allowEmpty: false }
  },
  request_type: {
    presence: { allowEmpty: false }
  }
}

export class PeopleGetCourseService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { course_id, user_id, request_type } = this.filteredArgs

      if (request_type === 'GetCourse') {
        const studentsEnrolled = await findStudentsEnrolledCount({ course_id })
        if (studentsEnrolled > 0) {
          return this.addError(ERRORS.NOT_FOUND, MESSAGES.CANNOT_EDIT_COURSE)
        }
      }

      const course = await getCourseById({ course_id, user_id })

      if (course) {
        const categoryTitle = await getCategoryTitleById({ category_id: course.category_id })
        const requiredCourses = await getRequiredCoursesById({ course_id })
        let requiredCoursesData = []

        if (requiredCourses && requiredCourses.length) {
          requiredCoursesData = await getRequiredCoursesData({ requiredCourses, user_id })
        }

        return formatCourseData({ course, categoryTitle, requiredCourses: requiredCoursesData })
      } else {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.COURSE_NOT_FOUND)
      }
    } catch (e) {
      logger.error(getErrorMessageForService('PeopleGetCourseService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
