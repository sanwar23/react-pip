import ServiceBase from '../../../common/serviceBase'
import { UserDetail } from '../../../db/models'
const constraints = {
  walletId: {
    presence: { allowEmpty: false }
  }
}

export class HandleInviteLinkService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { walletId } = this.filteredArgs
    const { user_id, first_name, last_name } = await UserDetail.findOne({ where: { wallet_address: walletId }, raw: true })
    // Redirect new Invitee to Registration page
    // Set flags for Registration with Invite
    return { with_invite: true, inviter_id: user_id, full_name: `${first_name} ${last_name}` }
  }
}
