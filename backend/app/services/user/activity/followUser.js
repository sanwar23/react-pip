import ServiceBase from '../../../common/serviceBase'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import logger from '../../../common/logger'
import { followOrUnfollowUser, getErrorMessageForService } from '../../helper'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  user_to_follow_id: {
    presence: { allowEmpty: false }
  },
  userCode: {
    presence: { allowEmpty: false }
  }
}

export class UserFollowService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_to_follow_id, user_id, userCode } = this.filteredArgs
      const followFlag = await followOrUnfollowUser({ user_to_follow_id, follower_id: user_id, userCode })

      if (!followFlag) {
        this.addError(ERRORS.FORBIDDEN, MESSAGES.CANNOT_FOLLOW)
      }

      return followFlag
    } catch (e) {
      logger.error(getErrorMessageForService('UserFollowService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
