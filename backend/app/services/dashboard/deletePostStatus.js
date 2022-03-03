import ServiceBase from '../../common/serviceBase'
import { ERRORS, MESSAGES } from '../../utils/errors'
import logger from '../../common/logger'
import { getErrorMessageForService, getUserActivityById, deleteStatusPost } from '../helper'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  user_activity_id: {
    presence: { allowEmpty: false }
  }
}

export class DashboardDeletePostStatusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id, user_activity_id } = this.filteredArgs
      const userActivityData = await getUserActivityById({ user_activity_id })
      if (userActivityData) {
        if (userActivityData.user_id === user_id) {
          await deleteStatusPost({ user_activity_id })
          return {
            userActivityId: userActivityData.user_activity_id,
            message: MESSAGES.STATUS_DELETED_SUCCESSFULLY
          }
        } else {
          this.addError(ERRORS.UNAUTHORIZED, MESSAGES.UNAUTHORIZED)
          return
        }
      } else {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.POST_STATUS_NOT_EXIST)
        return
      }
    } catch (err) {
      logger.error(getErrorMessageForService('DashboardDeletePostStatusService'), err)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
