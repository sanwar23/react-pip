import ServiceBase from '../../common/serviceBase'
import logger from '../../common/logger'
import { User, UserDetail } from '../../db/models'
import jwt from 'jsonwebtoken'
import config from '../../../config/app'
import SendEmailVerificationMailService from '../email/sendEmailVerificationMail'

const constraints = {
  email: {
    presence: { allowEmpty: false }
  }
}

export default class SendVerificationMailService extends ServiceBase {
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
          user_code: user.user_code
        },
        config.get('jwt.emailVerificationTokenSecret'),
        { expiresIn: config.get('jwt.emailVerificationTokenExpiry') })

        await SendEmailVerificationMailService.execute({ token, email })
      }
      return 'Mail sent successfully'
    } catch (err) {
      logger.error(`Error in ResendEmailVerificationMailService ${err}`)
    }
  }
}
