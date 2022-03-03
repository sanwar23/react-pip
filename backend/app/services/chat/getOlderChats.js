import ServiceBase from '../../common/serviceBase'
import { ERRORS } from '../../utils/errors'
import logger from '../../common/logger'
import { SqlHelper } from '../../utils/sql'
import { getConversationDetails, getReadMessages, getErrorMessageForService, formatMessagesOrder } from '../helper'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  conversation_id: {
    presence: { allowEmpty: false }
  },
  offset: {
    presence: { allowEmpty: false }
  }
}

export class GetOlderChatsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id, conversation_id, offset } = this.filteredArgs

      const conversation = await getConversationDetails({ conversation_id, user_id })

      if (conversation) {
        const { is_group, is_removed, updated_on, deleted_on } = conversation

        const messages = await SqlHelper.select(getReadMessages({
          conversation_id, user_id, is_group, is_removed, updated_on, offset, deleted_on
        }))

        const formattedMessages = formatMessagesOrder({ messageArray: [], messages: messages && messages.slice(0, 10) })

        return {
          messages: formattedMessages,
          more: messages && messages.length > 10
        }
      }
    } catch (e) {
      logger.error(getErrorMessageForService('GetOlderChatsService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
