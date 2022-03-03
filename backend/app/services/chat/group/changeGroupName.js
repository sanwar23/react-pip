import ServiceBase from '../../../common/serviceBase'
import { ERRORS } from '../../../utils/errors'
import logger from '../../../common/logger'
import { changeGroupName, getErrorMessageForService } from '../../helper'

const constraints = {
  conversation_id: {
    presence: { allowEmpty: false }
  },
  group_title: {
    presence: { allowEmpty: true }
  }
}

export class ChatChangeGroupNameService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { conversation_id, group_title } = this.filteredArgs

      await changeGroupName({ conversation_id, group_title })
    } catch (e) {
      logger.error(getErrorMessageForService('ChatChangeGroupNameService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
