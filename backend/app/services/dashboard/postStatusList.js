import ServiceBase from '../../common/serviceBase'
// import { XUserActivity } from '../../db/models'
import logger from '../../common/logger'
import {
  getErrorMessageForService,
  checkVisibility,
  getUserDetails, isUserLikedPost, getStatusLikesCount,
  getStatusCommentsCount,
  getAllActivityStatus
} from '../helper'
import { ERRORS } from '../../utils/errors'
import _ from 'lodash'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  owner_id: {
    presence: false
  }
}

export class GellAllPostStatusListService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      let statusList = await getAllActivityStatus({ owner_id: this.owner_id })

      statusList = await Promise.all(statusList.map(async (data) => {
        const isValidUser = await checkVisibility({
          activity_permission: data.activity_permission,
          user_id: this.user_id,
          owner_id: data.user_id
        })

        if (isValidUser) {
          const user = await getUserDetails({ user_id: data.user_id })
          data['owner'] = {
            userId: user.user_id,
            fullName: `${user.first_name} ${user.last_name}`,
            profilePic: user.profile_image
          }
          data['likesCount'] = await getStatusLikesCount({ record_id: data.user_activity_id })
          data['isPostLiked'] = await isUserLikedPost({ user_id: this.user_id, user_activity_id: data.user_activity_id })
          data['commentsCount'] = await getStatusCommentsCount({ record_id: data.user_activity_id })
          data['comments'] = []
          data['commentLoading'] = false
          return data
        } else {
          return false
        }
      }))

      return _.compact(statusList)
    } catch (e) {
      logger.error(`${getErrorMessageForService('GellAllPostStatusListService')} ${e}`)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
