import ServiceBase from '../../common/serviceBase'
import { getLiveAgentByUser, getUserById, getXferInboundGroups, getInboundGroupsByUser } from '../helper'
import GetSecurityContextService from '../user/getSecurityContext'
import _ from 'lodash'

const constraints = {
  userId: {
    presence: { allowEmpty: false }
  }
}

export class GetACDQueueService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let queues = []
    const currentUser = await getUserById({ user_id: this.userId })
    const { clientIngroups, currentClientId, clients } = await GetSecurityContextService.run({ user: currentUser })
    const liveAgentData = await getLiveAgentByUser({ user: currentUser, clients })

    if (liveAgentData) {
      queues = await getXferInboundGroups({ campaign_id: liveAgentData.campaign_id, clientIngroups })
    } else {
      queues = await getInboundGroupsByUser({ user: currentUser, client_id: currentClientId, clientIngroups })
    }

    queues = queues.map((queueData) => {
      return {
        group_id: queueData['group_id'],
        group_name: queueData['group_name']
      }
    })

    const sortedQueue = _.orderBy(queues, 'group_name', 'asc')

    return sortedQueue
  }
}
