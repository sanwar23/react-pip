import ServiceBase from '../../common/serviceBase'
import { Flow } from '../../db/models'
import { ERRORS, MESSAGES } from '../../utils/errors'

const constraints = {
  flowId: {
    presence: { allowEmpty: false }
  }
}

export class DeleteFlowService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    // Check if flow_id is valid or not
    const flowData = await Flow.findOne({ where: { flow_id: this.flowId }, raw: true })

    if (!(flowData && flowData['flow_id'])) {
      this.addError(ERRORS.NOT_FOUND, MESSAGES.FLOW_NOT_EXIST)
      return
    }

    // Delete flow_id
    await Flow.destroy({ where: { flow_id: this.flowId } })

    return flowData
  }
}
