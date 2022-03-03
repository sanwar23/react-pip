import ServiceBase from '../../../common/serviceBase'
import { deleteForumGroupTopic, getErrorMessageForService } from '../../helper'
import logger from '../../../common/logger'
import { ERRORS } from '../../../utils/errors'

const constraints = {
  owner_id: {
    presence: { allowEmpty: false }
  },
  group_id: {
    presence: { allowEmpty: false }
  },
  topic_id: {
    presence: { allowEmpty: false }
  }
}

export class ForumDeleteTopicService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { topic_id, group_id, owner_id } = this.filteredArgs
    try {
      await deleteForumGroupTopic({
        topic_id,
        group_id,
        owner_id
      })

      return {
        message: 'Forum Group Topic Deleted Successfully',
        data: {
          topic_id
        }
      }
    } catch (err) {
      logger.error(getErrorMessageForService('ForumDeleteTopicService'), err)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
