import ServiceBase from '../../common/serviceBase'
import config from '../../../config/app'
import logger from '../../common/logger'
import { notificationEmailTemplate } from '../../templates/notificationEmailTemplate'
import NodeMailer from '../../utils/getNodeMailer'

const constraints = {
  client_name: {
    presence: { allowEmpty: false }
  },
  client_username: {
    presence: { allowEmpty: false }
  },
  phone_number: {
    presence: { allowEmpty: false }
  },
  email: {
    presence: { allowEmpty: false }
  },
  serverPrivateIP: {
    presence: { allowEmpty: false }
  },
  serverPublicIP: {
    presence: { allowEmpty: false }
  },
  source: {
    presence: { allowEmpty: false }
  },
  interactions_per_month: {
    presence: { allowEmpty: false }
  },
  website: {
    presence: { allowEmpty: false }
  }
}

export default class SendEmailNotificationMailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const clientInfo = this.filteredArgs

    NodeMailer.sendMail({
      from: 'Qubicles <notifications@qubicles.io>',
      to: config.get('qubiclesMailIds.sales'),
      subject: 'New Client Registration',
      html: getHtml(clientInfo)
    }, (error, info) => {
      if (error) {
        logger.error(`Error in sending notification mail: ${error}`)
      } else {
        logger.info(`Notification email sent succesfully!! => ${JSON.stringify(info)}`)
      }
    })
  }
}

function getHtml (clientInfo) {
  const EMAIL_TEMPLATE_GREETING = 'Qubicles Team'
  const EMAIL_TEMPLATE_BODY = `
  A new prospect has registered from our website. Please verify this company prior to granting full access to our system.
  <br /><br />
  *********************************************************************
  <br />
  <b>Name:</b> ${clientInfo.client_name}
  <br />
  <b>Phone:</b> ${clientInfo.phone_number}
  <br />
  <b>Email:</b> ${clientInfo.email}
  <br />
  <b>Web:</b> ${clientInfo.website}
  <br />
  <b>How Did You Hear About Us?</b> ${clientInfo.source}
  <br />
  <b>Number of Employees?</b> ${clientInfo.interactions_per_month}
  <br />
  <br />
  Technical Note:
  <br />
  <b>Client SIP Domain:</b> ${clientInfo.client_username.toLowerCase()}.qubicles.io
  <br />
  <b>Client SIP Server IP (Internal):</b> ${clientInfo.serverPrivateIP}
  <br />
  <b>Client SIP Server IP (External):</b> ${clientInfo.serverPublicIP}
  <br />
  *********************************************************************
  `
  const EMAIL_TEMPLATE_CLOSING = 'Go ahead - send them a note. Thank them for choosing Qubicles ;)'

  return notificationEmailTemplate(EMAIL_TEMPLATE_GREETING, EMAIL_TEMPLATE_BODY, EMAIL_TEMPLATE_CLOSING)
}
