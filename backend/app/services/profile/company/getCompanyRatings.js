import ServiceBase from '../../../common/serviceBase'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService, getClientData } from '../../helper'
import { fetchCompanyRatings, getAddReviewAccessForClient } from '../../helper/companyProfile'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  client_id: {
    presence: { allowEmpty: false }
  }
}

export class GetCompanyRatingsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id, client_id } = this.filteredArgs
      const clientDetails = await getClientData({ client_id })
      if (!clientDetails) {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.CLIENT_NOT_EXIST)
        return
      }
      const addReviewAccess = await getAddReviewAccessForClient({ user_id, client_id })
      const ratings = await fetchCompanyRatings({ user_id, client_id })
      return { ratings, addReviewAccess }
    } catch (err) {
      logger.error(`${getErrorMessageForService('GetCompanyRatingsService')} ${err}`)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
