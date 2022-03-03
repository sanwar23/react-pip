import ServiceBase from '../../../common/serviceBase'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService } from '../../helper'
import { addAgentReviewAndRating, fetchAgentRatings, fetchAgentReviews, getAgentReviewByUser, updateAgentUserRating } from '../../helper/agentProfile'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  agent_user_id: {
    presence: { allowEmpty: false }
  },
  reviewData: {
    presence: { allowEmpty: false }
  }
}

export class PostAgentReviewService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id, agent_user_id, reviewData } = this.filteredArgs

      const userReview = await getAgentReviewByUser({ user_id, agent_user_id })
      if (userReview.length > 0) {
        this.addError(ERRORS.FORBIDDEN, MESSAGES.REVIEW_ALREADY_ADDED)
        return
      }

      await addAgentReviewAndRating({ user_id, agent_user_id, reviewData })
      const promises = [
        () => fetchAgentRatings({ agent_user_id }),
        () => fetchAgentReviews({ agent_user_id, type: 'received' })
      ]
      const [ratings, reviews] = await Promise.all(promises.map(promise => promise()))

      // Update agent rating in user details
      await updateAgentUserRating({ agent_user_id, rating: ratings.totalAverageRating })

      // WIP add review access
      return { ratings, reviews, addReviewAccess: false }
    } catch (err) {
      logger.error(`${getErrorMessageForService('PostAgentReviewService')} ${err}`)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
