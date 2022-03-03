import ServiceBase from '../../common/serviceBase'
import { ERRORS } from '../../utils/errors'
import logger from '../../common/logger'
import { formatChatListItem, getChatsList, getErrorMessageForService } from '../helper'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  offset: {
    presence: false
  },
  search_keyword: {
    presence: false
  }
}

export class GetAllChatsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id, offset, search_keyword } = this.filteredArgs
      const latestChats = await getChatsList({ user_id, offset, search_keyword })
      const formattedChatListItems = latestChats && latestChats.length > 0 && latestChats.slice(0, 10).map((item) => (
        item && formatChatListItem({ chatListItem: item })
      ))

      return {
        chatsList: formattedChatListItems || [],
        more: latestChats && latestChats.length > 10
      }
    } catch (e) {
      logger.error(getErrorMessageForService('GetAllChatsService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
