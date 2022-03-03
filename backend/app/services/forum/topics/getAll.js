import ServiceBase from '../../../common/serviceBase'
import { getForumGroupTopics, getErrorMessageForService } from '../../helper'
import logger from '../../../common/logger'
import { ERRORS } from '../../../utils/errors'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  group_id: {
    presence: { allowEmpty: false }
  },
  limit: {
    presence: { allowEmpty: false }
  },
  offset: {
    presence: { allowEmpty: false }
  }
}

export class ForumGetGroupTopicsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user_id, group_id, limit, offset } = this.filteredArgs
    try {
      const { rows, count } = await getForumGroupTopics({
        user_id,
        group_id,
        limit,
        offset
      })

      return {
        message: 'GetAll Forum Group\'s topics fetch successfully',
        topics: rows,
        count
      }
    } catch (err) {
      logger.error(getErrorMessageForService('ForumGetAllGroupService'), err)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
