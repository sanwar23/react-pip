import ServiceBase from '../../common/serviceBase'
import logger from '../../common/logger'
import { User, UserDetail } from '../../db/models'
import jwt from 'jsonwebtoken'
import config from '../../../config/app'
import { getErrorMessageForService } from '../helper'
import SendForgetPasswordMailService from '../email/sendForgetPasswordMail'
import { CONSTANTS } from '../../utils/success'

const constraints = {
  email: {
    presence: { allowEmpty: false }
  }
}

export default class ForgetPasswordMailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { email } = this.filteredArgs
    try {
      const user = await User.findOne({ where: { email } })
      if (user) {
        const userDetails = await UserDetail.findOne({ where: { user_id: user.user_id } })
        const token = jwt.sign({
          email,
          full_name: userDetails.full_name,
          user_id: user.user_id,
          user_code: user.user_code,
          token_type: CONSTANTS.FORGET_PASSWORD_TOKEN_TYPE
        },
        config.get('jwt.emailVerificationTokenSecret'),
        { expiresIn: config.get('jwt.emailVerificationTokenExpiry') })
        await SendForgetPasswordMailService.execute({ token, email })
      }
      return 'Reset password link sent successfully'
    } catch (err) {
      logger.error(`${getErrorMessageForService('ForgetPasswordMailService')} ${err}`)
    }
  }
}
