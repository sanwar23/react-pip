import { ERRORS, MESSAGES, APP_ERROR_CODES } from '../../../utils/errors'
import {
  updateProfileSettings,
  getUserTalentData,
  createUserTalentData,
  updateUserTalentData
} from '../../helper/agentProfile'
import { User } from '../../../db/models'
import { getErrorMessageForService } from '../../helper'
import ServiceBase from '../../../common/serviceBase'
import logger from '../../../common/logger'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  updatedData: {
    presence: { allowEmpty: false }
  },
  updatedDataType: {
    presence: { allowEmpty: false }
  }
}

export class UpdateAgentProfileSettingsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user_id, updatedData, updatedDataType } = this.filteredArgs

    try {
      const promises = [
        () => User.findOne({ where: { user_id } }),
        () => getUserTalentData({ user_id })
      ]
      const [user, talentData] = await Promise.all(promises.map(promise => promise()))

      if (!user) {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.USER_NOT_FOUND)
      }

      try {
        await updateProfileSettings({ user, updatedData, updatedDataType })
      } catch (error) {
        if (error.message === APP_ERROR_CODES.INCORRECT_PASSWORD) {
          this.addError(ERRORS.BAD_REQUEST, 'Current Password is Incorrect')
        }
        if (error.message === APP_ERROR_CODES.EMAIL_NOT_AVAILABLE) {
          this.addError(ERRORS.BAD_REQUEST, 'Email address already in use, please try with different email address')
        }
      }

      if (updatedDataType === 'Agent Info' && user.user_code === 'agent') {
        const newTalentData = {
          user_id: user.user_id,
          status: updatedData.onVacation ? 'on vacation' : 'available',
          desired_min_pay: updatedData.hourlyRate,
          desired_employment_type: updatedData.preferredJob,
          desired_location_type: updatedData.remoteJobs ? 'remote' : 'onsite',
          is_visible: updatedData.profileVisible
        }

        if (!talentData) {
          await createUserTalentData(newTalentData)
        } else {
          await updateUserTalentData(newTalentData)
        }
      }

      return { updatedDataType }
    } catch (err) {
      logger.error(`${getErrorMessageForService('UpdateAgentProfileSettingsService')} ${err}`)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
