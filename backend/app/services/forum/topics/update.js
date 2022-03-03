import ServiceBase from '../../../common/serviceBase'
import { updateForumTopic, getErrorMessageForService } from '../../helper'
import logger from '../../../common/logger'
import { ERRORS } from '../../../utils/errors'

const constraints = {
  topic_id: {
    presence: { allowEmpty: false }
  },
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

export class ForumUpdateTopicService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user_id, group_id, topic_id, title, description } = this.filteredArgs
    try {
      await updateForumTopic({
        topic_id,
        topic_title: title,
        owner_id: user_id,
        topic_description: description,
        group_id
      })

      return {
        message: 'Forum Topic updated successfully',
        data: {
          topic_id,
          topic_title: title,
          owner_id: user_id,
          topic_description: description,
          group_id
        }
      }
    } catch (err) {
      logger.error(getErrorMessageForService('ForumUpdateTopicService'), err)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
