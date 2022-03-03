import ServiceBase from '../../common/serviceBase'
import { UserContact } from '../../db/models'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  email: {
    presence: { allowEmpty: false }
  }
}

export class AddUserContactService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const contactAlreadyExist = await UserContact.findOne({ where: { user_id: this.user_id, referral_email: this.email }, raw: true })
    if (contactAlreadyExist === null) {
      await UserContact.create({
        user_id: this.user_id,
        referral_email: this.email
      })
      return 'Contact created successfully'
    } else return `Contact already exist with contact_user_id ${contactAlreadyExist.user_contact_id}`
  }
}
