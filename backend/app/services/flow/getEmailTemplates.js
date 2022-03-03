import ServiceBase from '../../common/serviceBase'
import { EmailTemplate } from '../../db/models'
import GetSecurityContextService, { USER_LEVEL } from '../user/getSecurityContext'

const constraints = {
  user: {
    presence: { allowEmpty: false }
  }
}

export class GetEmailTemplatesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let query = {}

    // We'll get details i.e userRef, username, clientsData
    // and clientIds
    const { currentClientId } = await GetSecurityContextService.run({ user: this.user })

    if (this.user.user_level < USER_LEVEL.SYSTEM) {
      query = {
        where: { client_id: currentClientId },
        order: [['description', 'ASC']],
        raw: true
      }
    } else {
      query = { raw: true }
    }

    const emailTemplateData = await EmailTemplate.findAll(query)

    return emailTemplateData
  }
}
