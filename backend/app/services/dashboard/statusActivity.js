import ServiceBase from '../../common/serviceBase'
import {
  getErrorMessageForService,
  checkVisibility,
  likeStatus, getUserActivityById, unlikeStatus
} from '../helper'
import { ERRORS, MESSAGES } from '../../utils/errors'
import logger from '../../common/logger'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  activity_type: {
    presence: { allowEmpty: false }
  },
  data: {
    presence: { allowEmpty: false }
  }
}

export class DashboardStatusActivityService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let activityResult
    try {
      const { user_id, activity_type, data } = this.filteredArgs
      const activityData = await getUserActivityById({ user_activity_id: data.userActivityId })
      if (!activityData) {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.POST_STATUS_NOT_EXIST)
        return
      }

      if (user_id !== activityData.user_id) {
        const isValidPermission = await checkVisibility({ activity_permission: activityData.activity_permission, user_id, owner_id: activityData.user_id })
        if (!isValidPermission) {
          this.addError(ERRORS.UNAUTHORIZED, MESSAGES.UNAUTHORIZED_MSG)
          return
        }
      }

      switch (activity_type) {
        case 'like':
          activityResult = await likeStatus({
            user_id,
            record_id: activityData.user_activity_id,
            activity_permission: activityData.activity_permission
          })
          if (activityResult && activityResult.isUserAlreadyLiked) {
            this.addError(ERRORS.BAD_DATA, MESSAGES.LIKE_ERROR_MESSAGE)
            return
          }
          break
        case 'unlike':
          activityResult = await unlikeStatus({
            user_id,
            record_id: activityData.user_activity_id,
            activity_permission: activityData.activity_permission
          })
          if (activityResult && activityResult.isUserAlreadyUnliked) {
            this.addError(ERRORS.BAD_DATA, MESSAGES.UNLIKE_ERROR_MESSAGE)
            return
          }
          break
      }
    } catch (err) {
      logger.error(getErrorMessageForService('DashboardStatusActivityService'), err)
      this.addError(ERRORS.INTERNAL)
    }
    return activityResult
  }
}
