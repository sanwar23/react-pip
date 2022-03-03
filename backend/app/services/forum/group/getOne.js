import ServiceBase from '../../../common/serviceBase'
import { getOneForumGroup, getErrorMessageForService } from '../../helper'
import logger from '../../../common/logger'
import { ERRORS, MESSAGES } from '../../../utils/errors'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  group_id: {
    presence: { allowEmpty: false }
  }
}

export class ForumGetOneGroupService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user_id, group_id } = this.filteredArgs
    try {
      const forumGroup = await getOneForumGroup({
        group_id,
        user_id
      })
      if (!forumGroup) {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.FORUM_GROUP_NOT_EXIST)
      }
      return {
        message: 'Group Fetched Successfully',
        data: forumGroup
      }
    } catch (err) {
      logger.error(getErrorMessageForService('ForumGetOneGroupService'), err)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
