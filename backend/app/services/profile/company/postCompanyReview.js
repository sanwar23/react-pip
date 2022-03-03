import ServiceBase from '../../../common/serviceBase'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService, getClientData } from '../../helper'
import {
  addCompanyReviewAndRating, getClientReviewByUser,
  fetchCompanyRatings, fetchCompanyReviews, updateClientUserRating
} from '../../helper/companyProfile'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  client_id: {
    presence: { allowEmpty: false }
  },
  reviewData: {
    presence: { allowEmpty: false }
  }
}

export class PostCompanyReviewService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id, client_id, reviewData } = this.filteredArgs
      const clientDetails = await getClientData({ client_id })
      if (!clientDetails) {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.CLIENT_NOT_EXIST)
        return
      }

      const userReview = await getClientReviewByUser({ user_id, client_id })
      if (userReview.length > 0) {
        this.addError(ERRORS.FORBIDDEN, MESSAGES.REVIEW_ALREADY_ADDED)
        return
      }

      await addCompanyReviewAndRating({ user_id, client_id, reviewData })
      const promises = [
        () => fetchCompanyRatings({ client_id }),
        () => fetchCompanyReviews({ client_id, type: 'received' })
      ]
      const [ratings, reviews] = await Promise.all(promises.map(promise => promise()))

      // Update client rating in client details
      await updateClientUserRating({ client_id, rating: ratings.totalAverageRating })

      // WIP add review access
      return { ratings, reviews, addReviewAccess: false }
    } catch (err) {
      logger.error(`${getErrorMessageForService('PostCompanyReviewService')} ${err}`)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
