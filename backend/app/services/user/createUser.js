import ServiceBase from '../../common/serviceBase'
import { User, UserDetail, UserContact } from '../../db/models'
import SendEmailVerificationMail from '../email/sendEmailVerificationMail'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../../../config/app'
import { ERRORS, MESSAGES } from '../../utils/errors'
import logger from '../../common/logger'
import { getErrorMessageForService } from '../helper'
import { generateUserWalletId } from '../../utils/generateWalletId'

const constraints = {
  email: {
    presence: { allowEmpty: false }
  },
  pass: {
    presence: { allowEmpty: false }
  },
  first_name: {
    presence: { allowEmpty: false }
  },
  last_name: {
    presence: { allowEmpty: false }
  },
  with_invite: {
    presence: { allowEmpty: false }
  },
  inviter_id: {
    presence: { allowEmpty: true }
  }
}

const MAX_USER_CREDIT = parseInt(config.get('invite.max_user_credit'))
const USER_CREDIT = parseInt(config.get('invite.user_credit'))
const REFERRAL_CREDIT = parseInt(config.get('invite.referral_credit'))

export class CreateUserService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const checkUserExist = await User.findOne({ where: { email: this.email }, raw: true })
    if (!checkUserExist) {
      const salt = bcrypt.genSaltSync(10)
      const full_name = this.first_name + ' ' + this.last_name
      // Updating user field by locally generated walletAddress.
      // This will be used in last step of postSignup where we create wallet on blockchain.
      const walletAddress = (await generateUserWalletId(full_name)).toLowerCase() + '.qbe'
      const newUser = {
        email: this.email,
        pass: bcrypt.hashSync(this.pass, salt),
        full_name: this.first_name + ' ' + this.last_name,
        email_verified: false,
        user: walletAddress
      }
      try {
        const user = await User.create(newUser)
        await UserDetail.create({
          user_id: user.user_id,
          first_name: this.first_name,
          last_name: this.last_name,
          wallet_address: walletAddress
        })
        const token = jwt.sign({
          email: this.email,
          full_name: user.full_name,
          user_id: user.user_id,
          user_code: user.user_code
        }, config.get('jwt.emailVerificationTokenSecret'), { expiresIn: config.get('jwt.emailVerificationTokenExpiry') })

        await SendEmailVerificationMail.execute({ token, email: this.email })

        // Check for invited Registration
        if (this.with_invite) {
          const { inviter_id } = this.args
          // Check for existing contact
          await findOrCreateContact({ user_id: inviter_id, referral_email: this.email })
          // Assign User and Referrel Credits rewards
          await assignCredits({ user_id: inviter_id, referral_email: this.email })
        }
        return user
      } catch (e) {
        logger.error(`${getErrorMessageForService('CreateUserService')} ${e}`)
        this.addError(ERRORS.INTERNAL)
      }
    }
    this.addError(ERRORS.FORBIDDEN, MESSAGES.EMAIL_ALREADY_REGISTERED)
  }
}

async function findOrCreateContact ({ user_id, referral_email }) {
  const contact = await UserContact.findOne({ where: { user_id, referral_email }, raw: true })
  if (contact === null) {
    // Create new Contact
    await UserContact.create({ user_id, referral_email, created_on: Date.now() })
  }
}

async function assignCredits ({ user_id, referral_email }) {
  const currentUserCredit = await getCurrentUserCredit({ user_id })
  // Check for maximum user_credit
  const newUserCredit = currentUserCredit + USER_CREDIT > MAX_USER_CREDIT ? (MAX_USER_CREDIT - currentUserCredit) : USER_CREDIT
  // Update user_credit and referral_credit
  await UserContact.update({ user_credit: newUserCredit, referral_credit: REFERRAL_CREDIT }, { where: { user_id, referral_email } })
}

async function getCurrentUserCredit ({ user_id }) {
  const contacts = await UserContact.findAll({ where: { user_id }, raw: true, attributes: ['user_credit'] })
  let totalUserCredits = 0
  if (contacts !== null) {
    for (const contact of contacts) {
      totalUserCredits += contact.user_credit
    }
  }
  return totalUserCredits
}
