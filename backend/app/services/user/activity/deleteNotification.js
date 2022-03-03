import ServiceBase from '../../../common/serviceBase'
import { ERRORS } from '../../../utils/errors'
import logger from '../../../common/logger'
import { deleteUserNotification, getErrorMessageForService } from '../../helper'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  notification_id: {
    presence: { allowEmpty: false }
  },
  offset: {
    presence: { allowEmpty: false }
  }
}

export class UserDeleteNotificationService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id, notification_id, offset } = this.filteredArgs
      const result = await deleteUserNotification({ user_id, notification_id, offset })

      return result
    } catch (e) {
      logger.error(getErrorMessageForService('UserDeleteNotificationService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
