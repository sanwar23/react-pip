import ServiceBase from '../../../common/serviceBase'
import { ERRORS } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService, getUserNotifications } from '../../helper'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  offset: {
    presence: { allowEmpty: false },
    numericality: { greaterThanOrEqualTo: 0 }
  }
}

export class UserGetNotificationsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id, offset } = this.filteredArgs
      const userNotifications = await getUserNotifications({ user_id, offset })

      return userNotifications
    } catch (e) {
      logger.error(getErrorMessageForService('UserGetNotificationsService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
