import ServiceBase from '../../../common/serviceBase'
import { ERRORS } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService } from '../../helper'
import { fetchCourseRating, formatCourseRating } from '../../helper/people'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  course_id: {
    presence: { allowEmpty: false }
  }
}

export class PeopleGetCourseRatingService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id, course_id } = this.filteredArgs

      const rating = await fetchCourseRating({ user_id, course_id })

      if (rating) {
        const formatedData = formatCourseRating({ rating })
        return formatedData
      }
    } catch (e) {
      logger.error(getErrorMessageForService('PeopleGetCourseRatingService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
