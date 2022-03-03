import ServiceBase from '../../common/serviceBase'
import logger from '../../common/logger'
import NodeMailer from '../../utils/getNodeMailer'
import { notificationEmailTemplate } from '../../templates/notificationEmailTemplate'

const constraints = {
  invitationLink: {
    presence: { allowEmpty: false }
  },
  inviter_first_name: {
    presence: { allowEmpty: false }
  },
  recipient_first_name: {
    presence: { allowEmpty: false }
  },
  forum_object_type: {
    presence: { allowEmpty: false }
  },
  email: {
    presence: { allowEmpty: false }
  }
}
export default class SendForumInvitationMailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { invitationLink, inviter_first_name, recipient_first_name, forum_object_type, email } = this.args

    NodeMailer.sendMail({
      from: 'Qubicles <invitations@qubicles.io>',
      to: email,
      subject: `${inviter_first_name} has invited you to join a private discussion`,
      html: getHtml({ invitationLink, inviter_first_name, recipient_first_name, forum_object_type })
    }, (error, info) => {
      if (error) {
        logger.error(`Error in sending Invitation mail: ${error}`)
      } else {
        logger.info(`Invitation email sent succesfully!! to ${email} => ${JSON.stringify(info)}`)
      }
    })
  }
}

function getHtml ({ invitationLink, inviter_first_name, recipient_first_name, forum_object_type }) {
  const EMAIL_TEMPLATE_GREETING = `Hi ${recipient_first_name}`
  const EMAIL_TEMPLATE_BODY = `
  ${inviter_first_name} has invited you to join a private discussion ${forum_object_type} in Qubicles!
  <br />
  Click <a href="${invitationLink}">here</a> to go there now.
  <br /><br />
  *********************************************************************
  `
  const EMAIL_TEMPLATE_CLOSING = ''
  return notificationEmailTemplate(EMAIL_TEMPLATE_GREETING, EMAIL_TEMPLATE_BODY, EMAIL_TEMPLATE_CLOSING)
}
