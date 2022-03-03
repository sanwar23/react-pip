import ServiceBase from '../../../common/serviceBase'
import { ERRORS } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService } from '../../helper'
import { fetchAgentReviews } from '../../helper/agentProfile'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  agent_user_id: {
    presence: { allowEmpty: false }
  },
  type: {
    presence: { allowEmpty: false }
  }
}

export class GetAgentReviewsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id, agent_user_id, type } = this.filteredArgs
      const reviews = await fetchAgentReviews({ user_id, agent_user_id, type })
      return reviews
    } catch (err) {
      logger.error(`${getErrorMessageForService('GetAgentReviewsService')} ${err}`)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
