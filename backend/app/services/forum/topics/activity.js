import ServiceBase from '../../../common/serviceBase'
import { topicActivity, getErrorMessageForService } from '../../helper'
import logger from '../../../common/logger'
import { ERRORS } from '../../../utils/errors'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  topic_id: {
    presence: { allowEmpty: false }
  },
  activity: {
    presence: { allowEmpty: false }
  }
}

export class ForumTopicActivity extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user_id, topic_id, activity } = this.filteredArgs
    try {
      await topicActivity({
        topic_id,
        activity,
        user_id
      })

      return {
        data: true,
        message: 'Activity registered successfully'
      }
    } catch (err) {
      logger.error(getErrorMessageForService('ForumTopicActivity'), err)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
