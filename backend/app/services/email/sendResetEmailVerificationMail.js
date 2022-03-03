import ServiceBase from '../../common/serviceBase'
import logger from '../../common/logger'
import NodeMailer from '../../utils/getNodeMailer'
import { notificationEmailTemplate } from '../../templates/notificationEmailTemplate'
import config from '../../../config/app'

const constraints = {
  email: {
    presence: { allowEmpty: false }
  },
  token: {
    presence: { allowEmpty: false }
  }
}
export default class SendResetEmailVerificationMailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const verifyEmailPageUrl = `${config.get('webApp.baseUrl')}/reset-email/${this.token}`
    logger.info(`verifyEmailPageUrl =========> ${verifyEmailPageUrl}`)

    NodeMailer.sendMail({
      from: 'Qubicles <notifications@qubicles.io>',
      to: this.email,
      subject: 'Please confirm your email',
      html: getHtml({ verifyEmailPageUrl })
    }, (error, info) => {
      if (error) {
        logger.error(`Error in sending verification mail: ${error}`)
      } else {
        logger.info(`Verification email sent succesfully!! => ${JSON.stringify(info)}`)
      }
    })
  }
}

function getHtml ({ verifyEmailPageUrl }) {
  const EMAIL_TEMPLATE_GREETING = 'Hello'
  const EMAIL_TEMPLATE_BODY = `
  Welcome to Qubicles!
  <br />
  <br />
  Your request to change email is processed successfully
  <br />
  <a href=${verifyEmailPageUrl}>Click Here</a> to verify your email
  <br />
  *********************************************************************
  <br />
  Or Copy the link below and paste it in your browser to verify your email
  <br />
  <br />
  ${verifyEmailPageUrl}
  <br /><br />
  *********************************************************************
  `
  const EMAIL_TEMPLATE_CLOSING = 'If you have not initiated this request, Kindly ignore the message!'
  return notificationEmailTemplate(EMAIL_TEMPLATE_GREETING, EMAIL_TEMPLATE_BODY, EMAIL_TEMPLATE_CLOSING)
}
