import ServiceBase from '../../common/serviceBase'
import { ERRORS } from '../../utils/errors'
import logger from '../../common/logger'
import {
  getLatestMessageDetails, updateXQodUserConversationsStatus, getErrorMessageForService, markMessagesAsRead
} from '../helper'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  conversation_id: {
    presence: { allowEmpty: false }
  }
}

export class DeleteChatService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { conversation_id, user_id } = this.filteredArgs

      const latestMessage = await getLatestMessageDetails({ conversation_id })

      if (latestMessage) {
        const { message_id, sent_at } = latestMessage
        const promiseArray = [
          () => updateXQodUserConversationsStatus({ user_id, conversation_id, all_read: true, deleted_on: sent_at }),
          () => markMessagesAsRead({ user_id, conversation_id })
        ]

        await Promise.all(promiseArray.map(promise => promise()))

        return message_id
      }
    } catch (e) {
      logger.error(getErrorMessageForService('DeleteChatService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
