import ServiceBase from '../../common/serviceBase'
import logger from '../../common/logger'
import { checkVisibility, getErrorMessageForService, getUserActivityById, commentStatus } from '../helper'
import { ERRORS, MESSAGES } from '../../utils/errors'

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

export class AddPostStatusCommentService extends ServiceBase {
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

      try {
        if (user_id !== activityData.user_id) {
          const isValidPermission = await checkVisibility({ activity_permission: activityData.activity_permission, user_id, owner_id: activityData.user_id })
          if (!isValidPermission) {
            this.addError(ERRORS.UNAUTHORIZED, MESSAGES.UNAUTHORIZED_MSG)
            return
          }
        }
        const newComment = await commentStatus({
          user_id,
          record_id: activityData.user_activity_id,
          activity_permission: activityData.activity_permission,
          activity_value: data.comment
        })
        return newComment
      } catch (e) {
      }
    } catch (error) {
      logger.error(getErrorMessageForService('AddPostStatusCommentService'), error)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
