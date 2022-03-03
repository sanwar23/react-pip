import ServiceBase from '../../../common/serviceBase'
import { FlowField } from '../../../db/models'
import { ERRORS, MESSAGES } from '../../../utils/errors'

const constraints = {
  fieldId: {
    presence: { allowEmpty: false }
  }
}

export class DeleteFlowFieldService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    // Check if field_id is valid or not
    const flowFieldData = await FlowField.findOne({ where: { field_id: this.fieldId }, raw: true })

    if (!(flowFieldData && flowFieldData.field_id)) {
      this.addError(ERRORS.NOT_FOUND, MESSAGES.FLOW_FIELD_NOT_EXIST)
      return
    }

    // Delete field_id
    await FlowField.destroy({ where: { field_id: this.fieldId } })

    return flowFieldData
  }
}
