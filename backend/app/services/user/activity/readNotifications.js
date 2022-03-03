import ServiceBase from '../../../common/serviceBase'
import { ERRORS } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService, readUserNotifications } from '../../helper'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  notification_ids: {
    presence: { allowEmpty: false }
  }
}

export class UserReadNotificationsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id, notification_ids } = this.filteredArgs
      const result = await readUserNotifications({ user_id, notification_ids })

      return result
    } catch (e) {
      logger.error(getErrorMessageForService('UserReadNotificationsService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
