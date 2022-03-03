import { SqlHelper } from './sql'
import { formatDate } from '../services/helper'
import _ from 'lodash'

const singleQuoteEscape = (input) => {
  let filteredInput = input
  // Reference link: https://stackoverflow.com/questions/1912095/how-to-insert-a-value-that-contains-an-apostrophe-single-quote
  if (!_.isEmpty(input) && _.isString(input)) {
    filteredInput = input.replace(/'/g, "''")
  }
  return filteredInput
}

// This method is used for inserting the primary key values in existing object data
const setPrimaryKeyValue = ({ ids, model, data }) => {
  const pKeyValue = ids[0]
  const modelProperties = model.rawAttributes
  const objProperties = Object.keys(data)
  for (let index = 0; index < objProperties.length; index++) {
    if (modelProperties[objProperties[index]] && modelProperties[objProperties[index]].primaryKey) {
      data[objProperties[index]] = pKeyValue
      break
    }
  }
}

const QueryMethods = {
  getGroupsByClient: ({ tableName, client_id }) => {
    return `SELECT t.* FROM ${tableName} t JOIN x_client_ingroups x ON t.group_id = x.group_id WHERE x.client_id =${client_id}`
  },
  getDataByColumnName: ({ sourceTable, columnName, columnValue, extraQueryAttributes }) => {
    let query = `SELECT * FROM ${sourceTable} WHERE ${columnName} = '${columnValue}'`
    if (extraQueryAttributes) {
      query = `${query} ${extraQueryAttributes}`
    }
    return query
  },
  deleteRecordByColumnName: ({ sourceTable, columnName, columnValue }) => {
    return `DELETE FROM ${sourceTable} WHERE ${columnName} = '${columnValue}' LIMIT 1`
  },
  getCampaignsByClientId: ({ sourceTable, client_id, orderByColumnName }) => {
    let query = `SELECT t.* FROM ${sourceTable} t JOIN x_client_campaigns x ON t.campaign_id = x.campaign_id WHERE x.client_id = '${client_id}'`
    if (orderByColumnName) {
      query = `${query} ORDER BY ${orderByColumnName}`
    }
    return query
  },
  getLeadCustomDataByColumnName: ({ list_id, sourceTable, columnName, columnValue }) => {
    return `SELECT c.*,l.status \`internal_sys_status\` FROM x_leads_custom_${list_id} c JOIN ${sourceTable} l ON c.lead_id=l.lead_id WHERE c.\`${columnName}\`='${columnValue}'`
  },
  // baseTable parameter is optional here and it is used for figuring out
  // the historical and archive table name
  getLogForContactByDates: ({ sourceTable, lead_id, startDate, endDate, baseTable }) => {
    const archiveTable = baseTable ? `${baseTable}_archive` : `${sourceTable}_archive`
    const historicalTable = baseTable ? `${baseTable}_historical` : `${sourceTable}_historical`

    return `SELECT * FROM ${sourceTable} WHERE lead_id='${lead_id}' AND call_date >= '${startDate}' AND call_date <= '${endDate}' UNION SELECT * FROM ${archiveTable} WHERE lead_id='${lead_id}' AND call_date >= '${startDate}' AND call_date <= '${endDate}' UNION SELECT * FROM ${historicalTable} WHERE lead_id='${lead_id}' AND call_date >= '${startDate}' AND call_date <= '${endDate}' ORDER BY call_date desc Limit 500`
  },
  addLeadToCustomTable: ({ list_id, lead_id }) => {
    return `INSERT INTO x_leads_custom_${list_id} (lead_id) VALUES ('${lead_id}');`
  },
  update: ({ sourceTable, model, data }) => {
    // get sourceTable from model if sourceTable property is empty
    if (!sourceTable) {
      sourceTable = model.tableName
    }

    // This will return the model attributes
    // Example: if sourceTable is 'x_leads_lists'
    // list_id: {
    //   autoIncrement: true,
    //   allowNull: false,
    //   primaryKey: true,
    // },
    // list_name: {
    //   fieldName: 'list_name'
    // }
    const modelProperties = model.rawAttributes
    let sql = `UPDATE ${sourceTable} SET `
    let whereClause = ''
    let hasWhereClause = false
    // Creating an array of property key
    // Example: updatedDataProperties = ['list_id', 'list_name']
    const updatedDataProperties = Object.keys(data)
    updatedDataProperties.forEach((property) => {
      // Check if primaryKey attribute is set to true for the property
      if (modelProperties[property] && modelProperties[property].primaryKey) {
        // If we have multiple primary keys (composite key) then we also need
        // to use AND in the where clause
        if (hasWhereClause) {
          whereClause += ` AND \`${property}\` = '${singleQuoteEscape(data[property])}'`
        } else {
          whereClause = ` WHERE \`${property}\` = '${singleQuoteEscape(data[property])}'`
        }

        hasWhereClause = true
      } else if (modelProperties[property]) {
        // Check if model field type is DATE
        if (modelProperties[property].type.key === 'DATE' || modelProperties[property].type === 'TIMESTAMP') {
          data[property] = formatDate(data[property])
        }

        // Setting the property field name and value
        sql += `\`${property}\` = '${singleQuoteEscape(data[property])}',`
      }
    })

    // remove trailing comma before appending where clause
    sql = sql.substring(0, sql.length - 1) + whereClause
    return sql
  },
  delete: ({ sourceTable, model, data }) => {
    if (!sourceTable) {
      sourceTable = model.tableName
    }

    const modelProperties = model.rawAttributes
    let sql = `DELETE FROM ${sourceTable}`
    let whereClause = ''
    let hasWhereClause = false

    const objProperties = Object.keys(data)

    objProperties.forEach((property) => {
      // Check if primaryKey attribute is set to true for the property
      if (modelProperties[property] && modelProperties[property].primaryKey) {
        // If we have multiple primary keys (composite key) then we also need
        // to use AND in the where clause
        if (hasWhereClause) {
          whereClause += ` AND \`${property}\` = '${singleQuoteEscape(data[property])}'`
        } else {
          whereClause = ` WHERE \`${property}\` = '${singleQuoteEscape(data[property])}'`
        }

        hasWhereClause = true
      }
    })

    sql = sql + whereClause
    return sql
  },
  insert: ({ sourceTable, model, data }) => {
    if (!sourceTable) {
      sourceTable = model.tableName
    }

    let sql = `INSERT INTO ${sourceTable} (`
    let values = ') VALUES ('
    const modelProperties = model.rawAttributes
    const objProperties = Object.keys(data)

    objProperties.forEach((property, index) => {
      if (modelProperties[property]) {
        sql += `\`${property}\``

        // Check if model field type is DATE
        if (modelProperties[property].type.key === 'DATE' || modelProperties[property].type === 'TIMESTAMP') {
          values += `'${formatDate(data[property])}'`
        } else {
          values += `'${singleQuoteEscape(data[property])}'`
        }

        if (index !== (objProperties.length - 1)) {
          sql += ','
          values += ','
        }
      }
    })

    sql = `${sql}${values});`

    return sql
  }
}

export const getRawQuery = ({ method, ...restArgs }) => {
  return QueryMethods[method](restArgs)
}

export const executeSelectQuery = ({ method, ...restArgs }) => {
  return SqlHelper.select(QueryMethods[method](restArgs))
}

export const executeUpdateQuery = ({ method, ...restArgs }) => {
  return SqlHelper.update(QueryMethods[method](restArgs))
}

export const executeInsertQuery = async ({ method, ...restArgs }) => {
  const insertedRecords = await SqlHelper.insert(QueryMethods[method](restArgs))
  // Setting the primary key values in existing object
  setPrimaryKeyValue({ ids: insertedRecords, ...restArgs })
}

export const executeDeleteQuery = ({ method, ...restArgs }) => {
  return SqlHelper.delete(QueryMethods[method](restArgs))
}
