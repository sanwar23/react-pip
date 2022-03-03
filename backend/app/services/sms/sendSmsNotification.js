import twilio from 'twilio'
import ServiceBase from '../../common/serviceBase'
import logger from '../../common/logger'
import { getErrorMessageForService } from '../helper'
import config from '../../../config/app'

const constraints = {
  mobile_number: {
    presence: { allowEmpty: false }
  },
  message: {
    presence: { allowEmpty: false }
  }
}
export default class SendSmsNotificationService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { mobile_number, message } = this.args

    try {
      const accountSid = config.get('twilio.accountSid')
      const authToken = config.get('twilio.authToken')
      const client = twilio(accountSid, authToken)

      client.messages
        .create({
          body: `${message}\n- Qubicles Team`,
          from: config.get('twilio.defaultMobileNumber'),
          to: `+${mobile_number.replace(/ /g, '')}`
        })
        .then(info => logger.info(`SMS sent succesfully to ${mobile_number} => ${JSON.stringify(info)}`))
        .catch(error => logger.error('Error in sending SMS Notification:', error))
    } catch (e) {
      logger.error(getErrorMessageForService('SendSmsNotificationService'), e)
    }
  }
}
