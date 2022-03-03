import ServiceBase from '../../../common/serviceBase'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import logger from '../../../common/logger'
import { blockOrUnblockUser, getErrorMessageForService, getNoOfFollowersAndFollowings } from '../../helper'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  block_user_id: {
    presence: { allowEmpty: false }
  }
}

export class UserBlockService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { block_user_id, user_id } = this.filteredArgs
      const blockFlag = await blockOrUnblockUser({ block_user_id, user_id })

      if (!blockFlag) {
        this.addError(ERRORS.FORBIDDEN, MESSAGES.CANNOT_BLOCK)
      }

      const { noOfFollowers, noOfFollowings } = await getNoOfFollowersAndFollowings({ user_id: block_user_id })

      return {
        noOfFollowers,
        noOfFollowings
      }
    } catch (e) {
      logger.error(getErrorMessageForService('UserBlockService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
