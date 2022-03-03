import ServiceBase from '../../../../common/serviceBase'
import { ERRORS } from '../../../../utils/errors'
import logger from '../../../../common/logger'
import { getErrorMessageForService, getTopCompanies } from '../../../helper'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  }
}

export class AgentGetTopCompaniesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const topCompaniesData = await getTopCompanies()
      const topCompaniesCards = topCompaniesData.map(job => {
        const { XClient: clientData } = job
        const { UserDetail: userDetailData } = job
        return {
          clientId: job.client_id,
          clientName: clientData.client_name,
          clientRating: clientData.rating,
          clientPic: userDetailData.profile_image,
          openPositions: job.openPositionCount
        }
      })
      return topCompaniesCards
    } catch (e) {
      logger.error(`${getErrorMessageForService('AgentGetTopCompaniesService')} ${e}`)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
