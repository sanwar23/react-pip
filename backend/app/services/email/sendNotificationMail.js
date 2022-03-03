import ServiceBase from '../../common/serviceBase'
import logger from '../../common/logger'
import NodeMailer from '../../utils/getNodeMailer'
import { newNotificationEmailTemplate } from '../../templates/newNotificationEmailTemplate'
import config from '../../../config/app'

const constraints = {
  email_id: {
    presence: { allowEmpty: false }
  },
  subject: {
    presence: { allowEmpty: false }
  },
  message: {
    presence: { allowEmpty: false }
  }
}
export default class SendNotificationMailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { email_id, subject, message } = this.args

    try {
      NodeMailer.sendMail({
        from: 'Qubicles <notifications@qubicles.io>',
        to: email_id,
        subject: subject,
        html: getHtml({ templateBody: message })
      }, (error, info) => {
        if (error) {
          logger.error('Error in sending Notification mail:', error)
        } else {
          logger.info(`Notification email sent succesfully!! to ${email_id} => ${JSON.stringify(info)}`)
        }
      })
    } catch (e) {
      logger.error('Error in sending Notification mail service', e)
    }
  }
}

function getHtml ({ templateBody }) {
  const EMAIL_TEMPLATE_BODY = templateBody
  const EMAIL_TEMPLATE_CLOSING = ''
  const EMAIL_TEMPLATE_TITLE = 'You have a new notification!'
  const EMAIL_TEMPLATE_IMAGE_SRC = config.get('emailTemplateImageSrc')

  return newNotificationEmailTemplate({
    EMAIL_TEMPLATE_IMAGE_SRC,
    EMAIL_TEMPLATE_TITLE,
    EMAIL_TEMPLATE_BODY,
    EMAIL_TEMPLATE_CLOSING
  })
}
