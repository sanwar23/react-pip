import ServiceBase from '../../../common/serviceBase'
import { ERRORS } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService } from '../../helper'
import { getAllViewCourses } from '../../helper/people'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  searchField: {
    presence: false
  },
  categoryId: {
    presence: false
  },
  courseFilter: {
    presence: false
  },
  offset: {
    presence: false
  }
}

export class PeopleGetAllViewCoursesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { searchField, categoryId, courseFilter, offset } = this.filteredArgs

      const allCourses = await getAllViewCourses({ searchField, categoryId, courseFilter, offset })

      return allCourses
    } catch (e) {
      logger.error(getErrorMessageForService('PeopleGetAllViewCoursesService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
