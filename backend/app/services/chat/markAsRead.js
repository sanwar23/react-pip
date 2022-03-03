import ServiceBase from '../../common/serviceBase'
import { ERRORS } from '../../utils/errors'
import logger from '../../common/logger'
import { getErrorMessageForService, updateXQodUserConversationsStatus, markMessagesAsRead } from '../helper'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  conversation_id: {
    presence: { allowEmpty: false }
  }
}

export class ChatMarkAsReadService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id, conversation_id } = this.filteredArgs
      const promises = [
        () => updateXQodUserConversationsStatus({ user_id, conversation_id, all_read: true }),
        () => markMessagesAsRead({ user_id, conversation_id })
      ]
      await Promise.all(promises.map(promise => promise()))
    } catch (e) {
      logger.error(getErrorMessageForService('ChatMarkAsReadService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
