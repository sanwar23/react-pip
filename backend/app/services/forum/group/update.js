import ServiceBase from '../../../common/serviceBase'
import { updateForumGroup, getErrorMessageForService } from '../../helper'
import logger from '../../../common/logger'
import { ERRORS } from '../../../utils/errors'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  group_id: {
    presence: { allowEmpty: false }
  },
  title: {
    presence: { allowEmpty: false }
  },
  description: {
    presence: { allowEmpty: false }
  },
  permission: {
    presence: { allowEmpty: false }
  }
}

export class ForumUpdateGroupService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user_id, title, description, permission, group_id } = this.filteredArgs
    try {
      await updateForumGroup({
        group_id,
        group_title: title,
        owner_id: user_id,
        group_description: description,
        permission: permission
      })

      return {
        message: 'Forum Group updated successfully',
        data: {
          group_id,
          group_title: title,
          owner_id: user_id,
          group_description: description,
          permission: permission
        }
      }
    } catch (err) {
      logger.error(getErrorMessageForService('ForumUpdateGroupService'), err)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
