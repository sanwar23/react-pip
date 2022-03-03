import ServiceBase from '../../../common/serviceBase'
import { ERRORS } from '../../../utils/errors'
import logger from '../../../common/logger'
import { changeGroupMembersStatus, getErrorMessageForService } from '../../helper'

const constraints = {
  conversation_id: {
    presence: { allowEmpty: false }
  },
  candidate_id: {
    presence: { allowEmpty: false }
  },
  updated_on: {
    presence: { allowEmpty: false }
  }
}

export class ChatRemoveGroupMemberService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { conversation_id, candidate_id, updated_on } = this.filteredArgs

      await changeGroupMembersStatus({
        conversation_id,
        user_ids: [candidate_id],
        is_removed: true,
        updated_on
      })
    } catch (e) {
      logger.error(getErrorMessageForService('ChatRemoveGroupMemberService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
