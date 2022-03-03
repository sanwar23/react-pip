import ServiceBase from '../../../common/serviceBase'
import { ERRORS } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService } from '../../helper'
import { fetchAllEnrolledCourses, formatEnrolledCoursesData } from '../../helper/people'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  }
}

export class PeopleGetAllEnrolledCoursesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id } = this.filteredArgs

      const courses = await fetchAllEnrolledCourses({ user_id })

      if (courses) {
        const formatedData = formatEnrolledCoursesData({ courses })
        return formatedData
      }
    } catch (e) {
      logger.error(getErrorMessageForService('PeopleGetAllEnrolledCoursesService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
