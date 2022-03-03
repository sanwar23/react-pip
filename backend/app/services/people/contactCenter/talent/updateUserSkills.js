import logger from '../../../../common/logger'
import ServiceBase from '../../../../common/serviceBase'
import { ERRORS } from '../../../../utils/errors'
import { CONSTANTS } from '../../../../utils/success'
import { getErrorMessageForService } from '../../../helper'
import { updateUserSkills, addUserEndorsement, removeUserEndorsement } from '../../../helper/people'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  candidate_id: {
    presence: { allowEmpty: false }
  },
  updatedData: {
    presence: { allowEmpty: true }
  },
  updatedDataType: {
    presence: { allowEmpty: false }
  }
}

export class PeopleUpdateUserSkillsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user_id, candidate_id, updatedData, updatedDataType } = this.filteredArgs

    try {
      const { SKILLS, ADD_ENDORSE, REMOVE_ENDORSE } = CONSTANTS

      if (updatedDataType === SKILLS) {
        return await updateUserSkills({ user_id, candidate_id, updatedData })
      } else if (updatedDataType === ADD_ENDORSE) {
        return await addUserEndorsement({ user_id, candidate_id, updatedData })
      } else if (updatedDataType === REMOVE_ENDORSE) {
        return await removeUserEndorsement({ user_id, candidate_id, updatedData })
      }
    } catch (err) {
      logger.error(`${getErrorMessageForService('PeopleUpdateUserSkillsService')} ${err}`)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
