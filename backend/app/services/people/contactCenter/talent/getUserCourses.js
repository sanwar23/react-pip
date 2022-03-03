import ServiceBase from '../../../../common/serviceBase'
import { getErrorMessageForService } from '../../../helper'
import { fetchUserCourses, formatUserCourseData } from '../../../helper/people'
import logger from '../../../../common/logger'
import { ERRORS } from '../../../../utils/errors'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  candidate_id: {
    presence: { allowEmpty: false }
  }
}

export class PeopleGetUserCoursesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { candidate_id } = this.filteredArgs

    try {
      const courses = await fetchUserCourses({ candidate_id })

      if (courses) {
        const formattedUserCourseData = formatUserCourseData({ courses })
        return formattedUserCourseData
      }
    } catch (err) {
      logger.error(getErrorMessageForService('PeopleGetUserCoursesService'), err)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
