import ServiceBase from '../../../../common/serviceBase'
import logger from '../../../../common/logger'
import {
  checkVisibility,
  getErrorMessageForService,
  getUserActivityById,
  deleteStatusPostComment
} from '../../../helper'
import { ERRORS, MESSAGES } from '../../../../utils/errors'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  user_activity_id: {
    presence: { allowEmpty: false }
  },
  data: {
    presence: { allowEmpty: false }
  }
}

export class DeletePostCommentsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id, user_activity_id, data } = this.filteredArgs
      const activityData = await getUserActivityById({ user_activity_id })
      if (!activityData) {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.POST_STATUS_NOT_EXIST)
        return
      }
      if (user_id !== activityData.user_id) {
        const postData = await getUserActivityById({ user_activity_id: data.postUserActivityId })
        const isValidPermission = await checkVisibility({
          activity_permission: activityData.activity_permission,
          user_id,
          owner_id: activityData.user_id
        })
        if (!isValidPermission || user_id !== postData.user_id) {
          this.addError(ERRORS.UNAUTHORIZED, MESSAGES.UNAUTHORIZED_MSG)
          return
        }
      }
      await deleteStatusPostComment({ user_activity_id })
      return {
        userActivityId: activityData.user_activity_id,
        message: MESSAGES.POST_COMMENT_DELETED_SUCCESSFULLY
      }
    } catch (error) {
      logger.error(`${getErrorMessageForService('DeletePostCommentsService')} ${error}`)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
