import ServiceBase from '../../../common/serviceBase'
import { getForumTopicComments, getErrorMessageForService } from '../../helper'
import logger from '../../../common/logger'
import { ERRORS } from '../../../utils/errors'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  topic_id: {
    presence: { allowEmpty: false }
  },
  limit: {
    presence: { allowEmpty: false }
  },
  offset: {
    presence: { allowEmpty: false }
  }
}

export class ForumGetTopicCommentsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { topic_id, limit, offset } = this.filteredArgs
    try {
      const topicComments = await getForumTopicComments({
        topic_id,
        limit,
        offset
      })

      return {
        message: 'GetAll Forum topic comments fetch successfully',
        comments: topicComments
      }
    } catch (err) {
      logger.error(getErrorMessageForService('ForumGetAllGroupService'), err)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
