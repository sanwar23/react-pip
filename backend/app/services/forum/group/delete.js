import ServiceBase from '../../../common/serviceBase'
import { deleteForumGroup, getErrorMessageForService } from '../../helper'
import logger from '../../../common/logger'
import { ERRORS } from '../../../utils/errors'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  group_id: {
    presence: { allowEmpty: false }
  }
}

export class ForumDeleteGroupService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user_id, group_id } = this.filteredArgs
    try {
      await deleteForumGroup({
        user_id,
        group_id
      })

      return {
        message: 'Forum Group Deleted Successfully',
        data: {
          group_id
        }
      }
    } catch (err) {
      logger.error(getErrorMessageForService('ForumDeleteGroupService'), err)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
