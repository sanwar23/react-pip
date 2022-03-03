import ServiceBase from '../../../common/serviceBase'
import { getAllForumGroups, getErrorMessageForService } from '../../helper'
import logger from '../../../common/logger'
import { ERRORS } from '../../../utils/errors'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  }
}

export class ForumGetAllGroupService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user_id } = this.filteredArgs
    try {
      const forumGroups = await getAllForumGroups({
        user_id
      })

      return {
        message: 'GetAll Forum Groups fetch successfully',
        groups: forumGroups
      }
    } catch (err) {
      logger.error(getErrorMessageForService('ForumGetAllGroupService'), err)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
