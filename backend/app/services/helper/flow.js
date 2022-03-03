import { FlowPage, FlowField, Flow, FlowLog } from '../../db/models'
import { Op } from 'sequelize'
import {
  listsFieldsTableExists,
  listsFieldsColumnExists,
  listsFieldsAddToTable
} from './index'

import { executeInsertQuery } from '../../utils/queryManager'

export const getFlowFieldsByFlowAndPageId = async ({ page, flow_id }) => {
  const FlowFields = await FlowField.findAll({
    where: { page, flow_id },
    raw: true
  })

  return FlowFields
}

export const getFlowByFlowId = async ({ flow_id }) => {
  return Flow.findOne({ where: { flow_id }, raw: true })
}

export const getFlowPagesByFlowId = (query) => {
  return FlowPage.findAll({ where: query, raw: true })
}

export const getFlowFieldsByFlowId = ({ flow_id }) => {
  return FlowField.findAll({ where: { flow_id }, raw: true })
}

export const getEditableFlowFieldsByFlowId = ({ flow_id }) => {
  const excludedFieldTypes = [
    'NAVIGATION',
    'SCRIPT',
    'CONDITION',
    'CALCULATION',
    'IFRAME',
    'IMAGE',
    'SPACE',
    'ACTION'
  ]

  return FlowField.findAll({
    where: { flow_id, field_type: { [Op.notIn]: excludedFieldTypes } },
    raw: true
  })
}

export const getFlowPageByPageId = ({ page_id }) => {
  return FlowPage.findOne({ where: { page_id }, raw: true })
}

export const syncListsFieldsWithFlow = async ({ list_id, flow_id, createIfNotExists }) => {
  // no need to check if user hasn't already imported a lead file...
  // up until they do, we can ignore any Flow script definition changes
  const isTableExists = await listsFieldsTableExists({ list_id })
  if (isTableExists || createIfNotExists) {
    const fields = await getEditableFlowFieldsByFlowId({ flow_id })

    if (fields && fields.length) {
      const promises = []
      fields.forEach((field) => {
        promises.push(async () => {
          const isColumnExists = await listsFieldsColumnExists({ list_id, columnName: field.field_label })
          if (isColumnExists) {
            // TODO:
          } else {
            await listsFieldsAddToTable({
              list_id,
              field_label: field.field_label,
              field_type: field.field_type,
              field_default: field.field_default,
              field_max: field.field_max,
              isTableExists
            })
          }
        })
      })

      return Promise.all(promises.map((promise) => promise()))
    }
  }
}

export const addFlowLog = ({ log }) => {
  return executeInsertQuery({
    method: 'insert',
    data: log,
    model: FlowLog
  })
}
