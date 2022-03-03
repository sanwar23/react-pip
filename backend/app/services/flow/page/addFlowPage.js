import ServiceBase from '../../../common/serviceBase'
import { FlowPage, Flow } from '../../../db/models'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import { createNewEntity, getFlowPagesByFlowId, getFirstElement } from '../../helper'

const constraints = {
  flowId: {
    presence: { allowEmpty: false }
  },
  pageName: {
    presence: false
  },
  pageDescription: {
    presence: false
  }
}

export class AddFlowPageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    // Check if flowId is valid or not
    const flowData = await Flow.findOne({ where: { flow_id: this.flowId }, raw: true })

    if (!(flowData && flowData['flow_id'])) {
      this.addError(ERRORS.NOT_FOUND, MESSAGES.FLOW_NOT_EXIST)
      return
    }

    // Check if flow_page for same pageName exist or not
    const flowPagesData = await getFlowPagesByFlowId({ flow_id: this.flowId, page_name: this.pageName })
    const flowPageData = getFirstElement(flowPagesData)
    let flowPage

    // Creating flowPage if pageName is not exist
    if (!(flowPageData && flowPageData['page_id'])) {
      flowPage = {
        flow_id: this.flowId,
        page_name: this.pageName,
        page_description: this.pageDescription,
        randomize_pages_off: 'True'
      }

      flowPage = await createNewEntity({ model: FlowPage, data: flowPage })
    }

    return flowPage
  }
}
