import ServiceBase from '../../common/serviceBase'
import { getClientIdByUserId } from '../helper/user'
import { getErrorMessageForService } from '../helper'
import { ERRORS } from '../../utils/errors'
import logger from '../../common/logger'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  }
}

export class LatestAnnouncementsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const client = await getClientIdByUserId({ user_id: this.user_id })
      if (client && client.client_id) {
        // Recent topics has to be redefined.
        const recentTopics = []
        const latestAnnouncements = recentTopics.map(topic => {
          return {
            id: topic.topic_id,
            title: topic.topic_title,
            date: topic.createdAt
          }
        })
        return latestAnnouncements
      } else {
        return []
      }
    } catch (err) {
      logger.error(getErrorMessageForService('LatestAnnouncementsService'), err)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
