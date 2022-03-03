import ServiceBase from '../../common/serviceBase'
import { ERRORS } from '../../utils/errors'
import logger from '../../common/logger'
import { formatSuggestedUser, getErrorMessageForService, getSuggestedUsersList } from '../helper'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  conversation_id: {
    presence: false
  },
  offset: {
    presence: false
  },
  search_keyword: {
    presence: false
  }
}

export class ChatGetSuggestedUsersService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id, conversation_id, offset, search_keyword } = this.filteredArgs
      const suggestedUsers = await getSuggestedUsersList({ user_id, conversation_id, offset, search_keyword })
      const formattedUsersData = suggestedUsers && suggestedUsers.length > 0 &&
        suggestedUsers.slice(0, 10).map((user) => user && formatSuggestedUser({ user }))

      return {
        suggestions: formattedUsersData || [],
        more: suggestedUsers.length > 10
      }
    } catch (e) {
      logger.error(getErrorMessageForService('ChatGetSuggestedUsersService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
