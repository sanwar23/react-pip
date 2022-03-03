import ServiceBase from '../../../common/serviceBase'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService } from '../../helper'
import { fetchCourseReviews, fetchCourseCompletionData, formatCourseReviewsData } from '../../helper/people'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  course_id: {
    presence: { allowEmpty: false }
  },
  review_filter: {
    presence: { allowEmpty: false }
  },
  offset: {
    presence: { allowEmpty: false }
  }
}

export class PeopleGetCourseReviewsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { course_id, review_filter: reviewFilter, offset } = this.filteredArgs

      const reviewsData = await fetchCourseReviews({ course_id, reviewFilter, offset })

      if (reviewsData && reviewsData.count) {
        const courseCompletionData = await fetchCourseCompletionData({
          userIds: reviewsData.reviews && reviewsData.reviews.map((review) => review.user_id),
          course_id
        })

        if (courseCompletionData) {
          const formatedData = formatCourseReviewsData({ reviewsData, courseCompletionData })
          return formatedData
        } else {
          this.addError(ERRORS.NOT_FOUND, MESSAGES.SERVER_ERROR)
        }
      } else {
        return reviewsData
      }
    } catch (e) {
      logger.error(getErrorMessageForService('PeopleGetCourseReviewsService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
