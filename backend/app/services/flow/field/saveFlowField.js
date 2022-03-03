import ServiceBase from '../../../common/serviceBase'
import { FlowField, Flow } from '../../../db/models'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService, createNewEntity } from '../../helper'
import _ from 'lodash'

const constraints = {
  field_id: {
    presence: false
  },
  flow_id: {
    presence: { allowEmpty: false }
  },
  page: {
    presence: false
  },
  field_label: {
    presence: false
  },
  field_name: {
    presence: false
  },
  field_description: {
    presence: false
  },
  field_rank: {
    presence: false
  },
  field_help: {
    presence: false
  },
  field_type: {
    presence: false
  },
  field_options: {
    presence: false
  },
  field_size: {
    presence: false
  },
  field_max: {
    presence: false
  },
  field_default: {
    presence: false
  },
  field_required: {
    presence: false
  },
  name_position: {
    presence: false
  },
  multi_position: {
    presence: false
  },
  field_order: {
    presence: false
  },
  goto_page: {
    presence: false
  },
  goto_field: {
    presence: false
  },
  field_hidden: {
    presence: false
  },
  field_validations: {
    presence: false
  },
  field_min: {
    presence: false
  },
  field_pattern: {
    presence: false
  }
}

export class SaveFlowFieldService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      // Get flow data
      const flowData = await Flow.findOne({ where: { flow_id: this.flow_id }, raw: true })

      if (!(flowData && flowData['flow_id'])) {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.FLOW_NOT_EXIST)
        return
      }

      const flowFieldData = {
        field_id: this.field_id,
        flow_id: this.flow_id,
        page: this.page,
        field_label: this.field_label,
        field_name: this.field_name,
        field_description: this.field_description,
        field_rank: this.field_rank,
        field_help: this.field_help,
        field_type: this.field_type,
        field_options: _.isEmpty(this.field_options) ? '' : this.field_options,
        field_size: this.field_size,
        field_max: this.field_max,
        field_default: this.field_default,
        field_required: this.field_required,
        name_position: this.name_position,
        multi_position: this.multi_position,
        field_order: this.field_order,
        goto_page: this.goto_page,
        goto_field: this.goto_field,
        field_hidden: this.field_hidden,
        field_validations: this.field_validations,
        field_min: this.field_min,
        field_pattern: this.field_pattern
      }

      flowData.flow_changed = 'Y'

      // Updating flow data
      await Flow.update(flowData, { where: { flow_id: this.flow_id }, raw: true })

      // Creating and updating the flow field data
      if (this.field_id > 0) {
        await FlowField.update(flowFieldData, { where: { flow_id: this.flow_id }, raw: true })
      } else {
        await createNewEntity({ model: FlowField, data: flowFieldData })
      }

      return flowData
    } catch (e) {
      logger.error(`${getErrorMessageForService('SaveFlowFieldService')} ${e}`)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
