import ServiceBase from '../../../common/serviceBase'
import { ERRORS } from '../../../utils/errors'
import logger from '../../../common/logger'
import { createNewGroup, addNewMembers, getErrorMessageForService, addConversationStatusEntry } from '../../helper'

const constraints = {
  user_ids: {
    presence: { allowEmpty: false }
  },
  group_title: {
    presence: { allowEmpty: true }
  }
}

export class ChatCreateNewGroupService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_ids, group_title } = this.filteredArgs

      const group = await createNewGroup({ group_title })

      if (group) {
        const { conversation_id } = group
        const promises = [
          () => addNewMembers({ conversation_id, user_ids }),
          () => addConversationStatusEntry({ conversation_id, user_ids })
        ]

        await Promise.all(promises.map(promise => promise()))

        return conversation_id
      }
    } catch (e) {
      logger.error(getErrorMessageForService('ChatCreateNewGroupService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
