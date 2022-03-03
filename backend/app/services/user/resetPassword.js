import ServiceBase from '../../common/serviceBase'
import { User } from '../../db/models'
import bcrypt from 'bcrypt'
import { ERRORS } from '../../utils/errors'
import logger from '../../common/logger'
import { getErrorMessageForService } from '../helper'

const constraints = {
  email: {
    presence: { allowEmpty: false }
  },
  pass: {
    presence: { allowEmpty: false }
  }
}

export class ResetPasswordService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const checkUserExist = await User.findOne({ where: { email: this.email }, raw: true })
      if (checkUserExist) {
        const salt = bcrypt.genSaltSync(10)
        const pass = bcrypt.hashSync(this.pass, salt)
        await User.update({ pass }, { where: { email: this.email } })
        return 'Password updated successfully'
      }
      this.addError(ERRORS.UNAUTHORIZED)
    } catch (err) {
      logger.error(`${getErrorMessageForService('ResetPasswordService')} ${err}`)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
