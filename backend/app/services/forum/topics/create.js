import ServiceBase from '../../../common/serviceBase'
import { createForumTopic, getErrorMessageForService } from '../../helper'
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
  }
}

export class ForumCreateTopicService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user_id, group_id, title, description } = this.filteredArgs
    try {
      const newForumTopic = await createForumTopic({
        topic_title: title,
        owner_id: user_id,
        topic_description: description,
        group_id
      })

      return {
        message: 'Forum Topic created Successfully',
        newTopic: {
          id: newForumTopic.topic_id,
          title: newForumTopic.topic_title,
          description: newForumTopic.topic_description,
          views: newForumTopic.views
        }
      }
    } catch (err) {
      logger.error(getErrorMessageForService('ForumCreateTopicService'), err)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
