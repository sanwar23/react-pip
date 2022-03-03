import ServiceBase from '../../common/serviceBase'
import logger from '../../common/logger'
import { UserContact } from '../../db/models'
import NodeMailer from '../../utils/getNodeMailer'
import { newNotificationEmailTemplate } from '../../templates/newNotificationEmailTemplate'
import config from '../../../config/app'

const constraints = {
  contacts: {
    presence: { allowEmpty: false }
  },
  inviteLink: {
    presence: { allowEmpty: false }
  },
  inviter_first_name: {
    presence: { allowEmpty: false }
  },
  inviter_last_name: {
    presence: { allowEmpty: false }
  },
  updateSent: {
    presence: { allowEmpty: false }
  },
  user_id: {
    presence: { allowEmpty: false }
  }
}
export default class SendEmailInvitationMailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { inviteLink, user_id, updateSent, contacts, inviter_first_name, inviter_last_name } = this.args
    try {
      for (const contact of contacts) {
        NodeMailer.sendMail({
          from: 'Qubicles <invitations@qubicles.io>',
          to: contact.email,
          subject: `${inviter_first_name} has invited you to join Qubicles!`,
          html: getHtml({ inviteUrl: inviteLink, name: contact.name, inviter_first_name, inviter_last_name })
        }, (error, info) => {
          if (error) {
            logger.error(`Error in sending Invitation mail: ${error}`)
          } else {
            logger.info(`Invitation email sent succesfully!! to ${contact.email} => ${JSON.stringify(info)}`)
          }
        })
        // Update x_user_contacts for invite
        if (updateSent) {
          await UserContact.update(
            { sent: Date.now() },
            { where: { user_id, referral_email: contact.email } })
        }
      }
    } catch (e) {
      logger.error(`Error in sending Invitation mail service: ${e}`)
    }
  }
}

function getHtml ({ inviteUrl, inviter_first_name, inviter_last_name }) {
  const EMAIL_TEMPLATE_BODY = `<p style="font-size:14px;font-family:'SF Pro Text';color:#4A4A4A;
  opacity:1">Qubicles is a revolutionary contact center service that allows businesses to easily
  find customer service, sales and support talent
  at any time, from any where in the world.</p>
  <p style="font-size:14px;font-family:'SF Pro Text';text-align:left;color:#4A4A4A;opacity:1">It is so unique that
  it runs on a revolutionary technology called <i>blockchain</i>! That just means it's
  trustworthy and reliable, and there are no middlemen like staffing companies taking 15-25%
  of your hard earned money.</p>
  <div style='text-align:center'>
    <h3 style="font-family:'Poppins', sans-serif;font-weight: bold;font-size:18px;color:#444F5F">Earn $5 when you register now</h3>
  </div>
  <div style='text-align:center'>
    <p style="font-family:'Poppins', sans-serif;color:#444F5F;font-size:14px">And up to <b>$100</b> for referring your friends!</p>
  </div>
  <br />
  <div style='text-align:center'>
  <a href=${inviteUrl} style='font-size:14px;color: #fff;margin:0;text-decoration:none;text-transform:none;cursor: pointer;' target='_blank'>
    <button style="width: 120px;border: none;background-color: #4877F4;color: #fff;border-radius: 6px;padding:10px 16px;
    font-family: 'Poppins', sans-serif;cursor: pointer;">
      Join Now
    </button>
    </a>
  </div>`
  const EMAIL_TEMPLATE_CLOSING = ` <span style="font-size:14px;font-family:'SF Pro Text';text-align:left;color:#4A4A4A;opacity:1">We hope
  you sign up today - even if it's just to collect this free money! Once you/'ve signed up, connect with <b>${inviter_first_name}</b> inside
  Qubicles. See you there!</span>`
  const EMAIL_TEMPLATE_TITLE = `${inviter_first_name} ${inviter_last_name} has invited you to join Qubicles!`
  const EMAIL_TEMPLATE_IMAGE_SRC = config.get('emailTemplateImageSrc')

  return newNotificationEmailTemplate({
    EMAIL_TEMPLATE_IMAGE_SRC,
    EMAIL_TEMPLATE_TITLE,
    EMAIL_TEMPLATE_BODY,
    EMAIL_TEMPLATE_CLOSING
  })
}
