import ServiceBase from '../../../common/serviceBase'
import { ERRORS } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService } from '../../helper'
import { fetchAgentRatings, getAddReviewAccessForAgent } from '../../helper/agentProfile'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  agent_user_id: {
    presence: { allowEmpty: false }
  }
}

export class GetAgentRatingsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id, agent_user_id } = this.filteredArgs
      const ratings = await fetchAgentRatings({ agent_user_id })

      const addReviewAccess = await getAddReviewAccessForAgent({ user_id, agent_user_id })
      return { ratings, addReviewAccess }
    } catch (err) {
      logger.error(`${getErrorMessageForService('GetAgentRatingsService')} ${err}`)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
