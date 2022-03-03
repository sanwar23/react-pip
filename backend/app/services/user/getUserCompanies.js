import ServiceBase from '../../common/serviceBase'
import { ERRORS } from '../../utils/errors'
import logger from '../../common/logger'
import { fetchUserCompanies, fetchClientDetails, formatCompaniesList, getErrorMessageForService } from '../helper'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  }
}

export class GetUserCompaniesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id } = this.filteredArgs

      const clientIds = await fetchUserCompanies({ user_id })

      if (clientIds) {
        const clientDetails = await fetchClientDetails({ clientIds })
        const formattedCompaniesList = formatCompaniesList({ clientDetails })
        return formattedCompaniesList
      }
    } catch (e) {
      logger.error(getErrorMessageForService('GetUserCompaniesService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
