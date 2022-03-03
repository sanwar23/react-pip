import ServiceBase from '../../../common/serviceBase'
import { ERRORS } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService, getAllCourseInfo, getTotalRaters, formatCourseCard } from '../../helper'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  }
}

export class PeopleGetAllCreatorCoursesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id } = this.filteredArgs

      const courses = await getAllCourseInfo({ creatorId: user_id })

      if (courses) {
        const totalRaters = await getTotalRaters({ courseIds: courses.map((item) => item.course_id) })

        const formattedCourses = courses.map(course => formatCourseCard({ course, totalRaters }))

        return formattedCourses
      }
    } catch (e) {
      logger.error(getErrorMessageForService('PeopleGetAllCreatorCoursesService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
