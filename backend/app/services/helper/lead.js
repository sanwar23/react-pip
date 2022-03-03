import { getListByListId } from './list'
import { getEditableFlowFieldsByFlowId } from './flow'
import { listsFieldsColumnExists, listsFieldsTableExists, formatDate, getFirstElement, asyncForEach } from './index'
import moment from 'moment'
import { SqlHelper } from '../../utils/sql'
import { USER_LEVEL } from '../user/getSecurityContext'
import {
  executeSelectQuery,
  executeUpdateQuery,
  executeDeleteQuery,
  executeInsertQuery
} from '../../utils/queryManager'
import { Lead } from '../../db/models'
import _ from 'lodash'

export const getLeadByLeadId = async ({ lead_id, user, clients }) => {
  const sourceTable = getLeadsTableName({ user, clients })
  const lead = await executeSelectQuery({
    method: 'getDataByColumnName',
    sourceTable,
    columnName: 'lead_id',
    columnValue: lead_id
  })

  return getFirstElement(lead)
}

export const getLeadsTableName = ({ user, clients }) => {
  if (user && user.user_level < USER_LEVEL.SYSTEM) {
    return `x_leads_${clients[0].client_username}_${clients[0].client_id}`
  } else {
    return 'x_leads_qubicles_1'
  }
}

export const updateLead = async ({ lead, user, clients }) => {
  const sourceTable = getLeadsTableName({ user, clients })
  await executeUpdateQuery({
    method: 'update',
    sourceTable,
    model: Lead,
    data: lead
  })
}

export const deleteLead = async ({ lead, user, clients }) => {
  const sourceTable = getLeadsTableName({ user, clients })
  await executeDeleteQuery({
    method: 'delete',
    sourceTable,
    model: Lead,
    data: lead
  })
}

export const getLeadCustomData = async ({ list_id, lead_id }) => {
  let lead = {}
  const isTableExist = await listsFieldsTableExists({ list_id })
  if (isTableExist) {
    lead = await executeSelectQuery({
      method: 'getDataByColumnName',
      sourceTable: `x_leads_custom_${list_id}`,
      columnName: 'lead_id',
      columnValue: lead_id,
      extraQueryAttributes: 'LIMIT 1'
    })
  }
  return _.isEmpty(lead) ? lead : getFirstElement(lead)
}

export const deleteLeadCustomData = async ({ list_id, lead_id }) => {
  let lead = {}
  const isTableExist = await listsFieldsTableExists({ list_id })
  if (isTableExist) {
    lead = await executeDeleteQuery({
      method: 'deleteRecordByColumnName',
      sourceTable: `x_leads_custom_${list_id}`,
      columnName: 'lead_id',
      columnValue: lead_id
    })
  }
  return lead
}

export const getLeadByPhone = async ({ phone_number, user, clients }) => {
  const sourceTable = getLeadsTableName({ user, clients })
  const lead = await executeSelectQuery({
    method: 'getDataByColumnName',
    sourceTable,
    columnName: 'phone_number',
    columnValue: phone_number,
    extraQueryAttributes: 'LIMIT 100'
  })
  return lead
}

export const updateLeadInCustomTable = async ({ lead }) => {
  const list_id = lead['list_id']
  // send custom fields update
  let onDuplicateUpdateSQL = ' ON DUPLICATE KEY UPDATE '
  const insertSql = `INSERT INTO x_leads_custom_${list_id} SET `
  let sql = ''

  // get all fields in this list to aide with data type checks
  const leadList = await getListByListId({ list_id })
  const flowFields = await getEditableFlowFieldsByFlowId({ flow_id: leadList.flow_id })

  // build dynamic SQL to do so
  let customFieldValuesSet = false
  const fieldsProcessed = []
  const keys = Object.keys(lead)

  asyncForEach(keys, async (key, index) => {
    const keyInLowerCase = key.toLowerCase()
    const flowFieldDefinition = flowFields.find((f) => f.field_label.toLowerCase() === keyInLowerCase)
    // save this field to our custom table
    let isKeyValid = !fieldsProcessed.includes(keyInLowerCase) &&
      key !== 'lead_id' &&
      lead[key] &&
      flowFieldDefinition

    if (isKeyValid) {
      isKeyValid = await listsFieldsColumnExists({ list_id: lead['list_id'], columnName: key })
    }

    if (isKeyValid) {
      let fieldValue = lead[key] || ''

      if (fieldValue) {
        fieldValue = fieldValue.replace(new RegExp('[{}]', 'g'), '')
      }

      if (fieldValue && moment(fieldValue, 'YYYY-MM-DD').isValid() && flowFieldDefinition.field_type === 'DATEPICKER') {
        sql += `\`${key}\` = '${formatDate(fieldValue)}',`
      } else {
        sql += `\`${key}\` = '${fieldValue}',`
      }

      onDuplicateUpdateSQL += `\`${key}\` = VALUES(\`${key}\`),`
      customFieldValuesSet = true
      fieldsProcessed.push(keyInLowerCase)
    }

    // send update
    if (((index) === keys.length - 1) && customFieldValuesSet) {
      sql += `lead_id = '${lead.lead_id}'`
      onDuplicateUpdateSQL += 'lead_id = VALUES(lead_id)'
      const fullQuery = insertSql + sql + onDuplicateUpdateSQL
      await SqlHelper.insert(fullQuery)
    }
  })
}

export const createClientLeadTable = ({ client_id }) => {
  return SqlHelper.callProcedure({
    procedure: 'process_create_client_leadtable (:var_client_id)',
    replacements: { var_client_id: client_id }
  })
}

export const addListLead = async ({ lead, user, clients, client_id }) => {
  // make sure client's lead table exists
  if (user && user.user_level < USER_LEVEL.SYSTEM) {
    await createClientLeadTable({ client_id })
  }

  const sourceTable = getLeadsTableName({ user, clients })
  return executeInsertQuery({
    method: 'insert',
    model: Lead,
    sourceTable,
    data: lead
  })
}

export const addLeadToCustomTable = async ({ list_id, lead_id }) => {
  const isTableExist = await listsFieldsTableExists({ list_id })

  if (isTableExist) {
    return executeInsertQuery({
      method: 'addLeadToCustomTable',
      lead_id,
      list_id
    })
  }
}

export const deleteLeadFromLeadQueue = async ({ lead_id, user, clients }) => {
  const sourceTable = getQueueTableName({ user, clients })
  await executeDeleteQuery({
    method: 'deleteRecordByColumnName',
    sourceTable,
    columnName: 'lead_id',
    columnValue: lead_id
  })
}

export function getQueueTableName ({ user, clients }) {
  if (user && user.user_level < USER_LEVEL.SYSTEM) {
    return `x_leads_queue_${clients[0].client_username}_${clients[0].client_id}`
  } else {
    return 'x_leads_qubicles_1'
  }
}

export const getLeadCustomDataByColumnName = async ({ list_id, columnName, columnValue, user, clients }) => {
  let lead = {}
  const isTableExist = await listsFieldsTableExists({ list_id })
  const isColumnExist = await listsFieldsColumnExists({ list_id, columnName })

  if (isTableExist && isColumnExist) {
    const sourceTable = getLeadsTableName({ user, clients })
    lead = await executeSelectQuery({
      method: 'getLeadCustomDataByColumnName',
      sourceTable,
      columnName,
      columnValue,
      list_id
    })
  }

  return lead
}
