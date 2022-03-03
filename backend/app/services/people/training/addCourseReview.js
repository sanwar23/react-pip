import ServiceBase from '../../../common/serviceBase'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService } from '../../helper'
import {
  addCourseReview,
  fetchCourseRating,
  fetchCourseReviews,
  fetchCourseCompletionData,
  formatCourseRating,
  formatCourseReviewsData,
  updateCourseRating
} from '../../helper/people'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  course_id: {
    presence: { allowEmpty: false }
  },
  review_data: {
    presence: { allowEmpty: false }
  }
}

export class PeopleAddCourseReviewService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id, course_id, review_data: reviewData } = this.filteredArgs

      await addCourseReview({ user_id, course_id, reviewData })

      const rating = await fetchCourseRating({ user_id, course_id })

      const reviewsData = await fetchCourseReviews({ course_id, reviewFilter: 'latest', offset: 0 })

      if (rating && reviewsData && reviewsData.count) {
        const courseCompletionData = await fetchCourseCompletionData({
          userIds: reviewsData.reviews && reviewsData.reviews.map((review) => review.user_id),
          course_id
        })

        if (courseCompletionData) {
          const courseRatingFormatedData = formatCourseRating({ rating })
          const courseReviewsFormatedData = formatCourseReviewsData({ reviewsData, courseCompletionData })

          if (courseRatingFormatedData && courseReviewsFormatedData) {
            await updateCourseRating({
              course_id,
              rating: courseRatingFormatedData.ratings && courseRatingFormatedData.ratings.totalAverageRating
            })

            return {
              ...courseRatingFormatedData,
              reviewData: courseReviewsFormatedData
            }
          }
        } else {
          this.addError(ERRORS.NOT_FOUND, MESSAGES.SERVER_ERROR)
        }
      } else {
        return reviewsData
      }
    } catch (e) {
      logger.error(getErrorMessageForService('PeopleAddCourseReviewService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
