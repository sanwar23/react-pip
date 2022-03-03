import ServiceBase from '../../common/serviceBase'
import { XClient, XClientUser } from '../../db/models'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  }
}

export default class GetClientsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const clientIdsData = await XClientUser.findAll({
      where: { user_id: this.user_id },
      attributes: ['client_id'],
      raw: true
    })

    const clientIds = clientIdsData.map((client) => client['client_id'])

    const clients = await XClient.findAll({ where: { client_id: clientIds }, raw: true })

    return { clients, clientIds }
  }
}
