import { ERRORS, MESSAGES, APP_ERROR_CODES } from '../../../utils/errors'
import { updateProfileSettings } from '../../helper/companyProfile'
import { getClientIdByUserId, getErrorMessageForService } from '../../helper'
import ServiceBase from '../../../common/serviceBase'
import { User } from '../../../db/models'

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

export class UpdateCompanyProfileSettingsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user_id, updatedData, updatedDataType } = this.filteredArgs

    try {
      const promises = [
        () => User.findOne({ where: { user_id } }),
        () => getClientIdByUserId({ user_id })
      ]
      const [user, clientUser] = await Promise.all(promises.map(promise => promise()))

      if (!user) {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.USER_NOT_FOUND)
      }
      if (!(clientUser && clientUser.client_id)) {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.CLIENT_NOT_FOUND)
      }

      try {
        await updateProfileSettings({ user, clientUser, updatedData, updatedDataType })
      } catch (error) {
        if (error.message === APP_ERROR_CODES.INCORRECT_PASSWORD) {
          this.addError(ERRORS.BAD_REQUEST, 'Current Password is Incorrect')
        }
        if (error.message === APP_ERROR_CODES.EMAIL_NOT_AVAILABLE) {
          this.addError(ERRORS.BAD_REQUEST, 'Email address already in use, please try with different email address')
        }
      }

      return { updatedDataType }
    } catch (err) {
      getErrorMessageForService('UpdateCompanyProfileSettingsService')
    }
  }
}
