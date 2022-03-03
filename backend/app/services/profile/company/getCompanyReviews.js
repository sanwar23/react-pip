import ServiceBase from '../../../common/serviceBase'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService, getClientData } from '../../helper'
import { fetchCompanyReviews } from '../../helper/companyProfile'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  client_id: {
    presence: { allowEmpty: false }
  },
  type: {
    presence: { allowEmpty: false }
  }
}

export class GetCompanyReviewsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id, client_id, type } = this.filteredArgs
      const clientDetails = await getClientData({ client_id })
      if (!clientDetails) {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.CLIENT_NOT_EXIST)
        return
      }
      const reviews = await fetchCompanyReviews({ user_id, client_id, type })
      return reviews
    } catch (err) {
      logger.error(`${getErrorMessageForService('GetCompanyReviewsService')} ${err}`)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
