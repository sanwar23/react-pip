import ServiceBase from '../../common/serviceBase'
import { Flow } from '../../db/models'

export class GetFlowsService extends ServiceBase {
  async run () {
    // Check if flowId is valid or not
    const flowData = await Flow.findAll({
      order: [['flow_name', 'ASC']],
      raw: true
    })

    return flowData
  }
}
