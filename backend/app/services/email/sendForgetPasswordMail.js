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
export default class SendForgetPasswordMailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const forgetPasswordPageUrl = `${config.get('webApp.baseUrl')}/verify-token/${this.token}`
    logger.info(`forgetPasswordPageUrl =========> ${forgetPasswordPageUrl}`)

    NodeMailer.sendMail({
      from: 'Qubicles <notifications@qubicles.io>',
      to: this.email,
      subject: 'Click on link to generate new password',
      html: getHtml({ forgetPasswordPageUrl })
    }, (error, info) => {
      if (error) {
        logger.error(`Error in sending forget password mail: ${error}`)
      } else {
        logger.info(`Forget password email sent succesfully!! => ${JSON.stringify(info)}`)
      }
    })
  }
}

function getHtml ({ forgetPasswordPageUrl }) {
  const EMAIL_TEMPLATE_GREETING = 'Hello'
  const EMAIL_TEMPLATE_BODY = `
  Welcome to Qubicles!
  <br />
  <br />
  Please click on below link to set new password for your registered account.
  <br />
  <a href=${forgetPasswordPageUrl}>Click Here</a> to verify your email
  <br />
  *********************************************************************
  <br />
  Or Copy the link below and paste it in your browser to set new password.
  <br />
  <br />
  ${forgetPasswordPageUrl}
  <br /><br />
  *********************************************************************
  `
  const EMAIL_TEMPLATE_CLOSING = ''
  return notificationEmailTemplate(EMAIL_TEMPLATE_GREETING, EMAIL_TEMPLATE_BODY, EMAIL_TEMPLATE_CLOSING)
}
