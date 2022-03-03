import ServiceBase from '../../../common/serviceBase'
import config from '../../../../config/app'
import { google } from 'googleapis'
import jwt from 'jsonwebtoken'
import { UserDetail } from '../../../db/models'
import SendEmailInvitationMail from '../../email/sendEmailInvitationMail'
import { AddUserContactService } from '../addUserContact'
import { ERRORS } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService } from '../../helper'

const constraintsAuth = {
  user_id: {
    presence: { allowEmpty: false }
  }
}
const baseInviteUrl = `${config.get('webApp.baseUrl')}/invite`
const clientId = config.get('google.clientId')
const clientSecret = config.get('google.clientSecret')
const redirectUri = config.get('google.callbackURL')

export class InviteWithGoogleAuthService extends ServiceBase {
  get constraints () {
    return constraintsAuth
  }

  async run () {
    const scopes = ['https://www.googleapis.com/auth/contacts.readonly']

    // User id embedded in the OAuth state
    const stateToken = jwt.sign({ user_id: this.args.user_id }, config.get('invite.secret'))

    try {
      // Make new google OAuth client
      const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri)

      // Generate OAuth url for reading google contacts
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        state: stateToken
      })

      return authUrl
    } catch (err) {
      logger.error(`${getErrorMessageForService('InviteWithGoogleAuthService')} ${err}`)
      this.addError(ERRORS.INTERNAL)
    }
  }
}

const constraintsCallback = {
  code: {
    presence: { allowEmpty: false }
  },
  state: {
    presence: { allowEmpty: false }
  }
}

export class InviteWithGoogleCallbackService extends ServiceBase {
  get constraints () {
    return constraintsCallback
  }

  async run () {
    const { code, state } = this.filteredArgs
    // Verify State
    const { user_id } = jwt.verify(state, config.get('invite.secret'))

    // Fetch wallet address from User
    const userDetails = await UserDetail.findOne({ where: { user_id }, raw: true })
    const walletAddress = userDetails.wallet_address

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri)
    const emails = new Set()
    const contacts = []
    try {
      const { tokens } = await oauth2Client.getToken(code)
      await oauth2Client.setCredentials(tokens)
      const service = google.people({ version: 'v1', auth: oauth2Client })
      const { data } = await service.people.connections.list({
        resourceName: 'people/me',
        personFields: 'names,emailAddresses'
      })
      if (data !== null || data !== undefined) {
        if (data.connections) {
          for (const connection of data.connections) {
            const contactObj = {}
            const contactEmails = connection.emailAddresses
            const contactNames = connection.names
            if (contactEmails !== undefined) {
              const primaryEmail = contactEmails[0]
              if (primaryEmail.value) {
                contactObj.email = primaryEmail.value
                // Check for duplicate emails in connections
                if (emails.has(primaryEmail.value.toLowerCase())) {
                  continue
                }
              }
            }
            if (contactNames !== undefined) {
              const primaryName = contactNames[0]
              if (primaryName.givenName) {
                contactObj.name = primaryName.displayName
              }
            }
            // Add email to emails set
            contacts.push({ name: contactObj.name, email: contactObj.email })
            emails.add(contactObj.email.toLowerCase())
          }
        } else {
          return 'No connections present'
        }
      }
    } catch (err) {
      logger.error(`${getErrorMessageForService('InviteWithGoogleCallbackService')} ${err}`)
      this.addError(ERRORS.INTERNAL)
    }
    // Add contactEmails to x_user_contacts
    for (const contact of contacts) {
      await AddUserContactService.execute({ email: contact.email, user_id })
    }

    // Send Invitation link to contactEmails
    const inviteLink = `${baseInviteUrl}/${walletAddress}`
    await SendEmailInvitationMail.execute({
      contacts,
      inviteLink,
      inviter_first_name: userDetails.first_name,
      inviter_last_name: userDetails.last_name,
      user_id,
      updateSent: true
    })
    return 'Contacts invited successfully'
  }
}
