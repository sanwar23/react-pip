import ServiceBase from '../../common/serviceBase'
import { ERRORS } from '../../utils/errors'
import logger from '../../common/logger'
import { updateXQodUserConversationsStatus, getErrorMessageForService } from '../helper'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  conversation_id: {
    presence: { allowEmpty: false }
  }
}

export class ChatMarkAsUnreadService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id, conversation_id } = this.filteredArgs
      await updateXQodUserConversationsStatus({ user_id, conversation_id, all_read: false })
    } catch (e) {
      logger.error(getErrorMessageForService('ChatMarkAsUnreadService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
