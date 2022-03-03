import { XLeadsList } from '../../db/models'
import { SqlHelper } from '../../utils/sql'
import { getArchiveTableName, flatArray } from './common'
import { executeSelectQuery } from '../../utils/queryManager'
import _ from 'lodash'

export const DEFAULT_SYSTEM_LIST_OB = 998
export const DEFAULT_SYSTEM_LIST_IB = 999

export const getListByListId = ({ list_id }) => {
  return XLeadsList.findOne({ where: { list_id }, raw: true })
}

export const listsFieldsTableExists = async ({ list_id }) => {
  const sql = `SHOW TABLES LIKE 'x_leads_custom_${list_id}'`
  const data = await SqlHelper.showTables(sql)
  const isTableExist = !_.isEmpty(data)
  return isTableExist
}

export const getLists = async ({ campaigns }) => {
  const promises = []
  if (campaigns && campaigns.length) {
    campaigns.forEach((campaign) => {
      promises.push(() => getAllLists({ campaign_id: campaign.campaign_id }))
    })
  }

  let lists = await Promise.all(promises.map((promise) => promise()))

  if (lists && lists.length) {
    lists = flatArray(lists)
  }

  return lists
}

export const getAllLists = async ({ campaign_id }) => {
  let lists = await executeSelectQuery({
    method: 'getDataByColumnName',
    sourceTable: getArchiveTableName(XLeadsList),
    columnName: 'campaign_id',
    columnValue: campaign_id
  })

  const listByCampaignId = await getListsByCampaignId({ campaign_id })
  lists = [...lists, ...listByCampaignId]

  return lists.filter((list) => {
    return (list.list_id !== DEFAULT_SYSTEM_LIST_OB && list.list_id !== DEFAULT_SYSTEM_LIST_IB)
  })
}

export const getListsByCampaignId = async ({ campaign_id }) => {
  const lists = await executeSelectQuery({
    method: 'getDataByColumnName',
    sourceTable: XLeadsList.tableName,
    columnName: 'campaign_id',
    columnValue: campaign_id
  })

  return lists
}

export const listsFieldsAddToTable = async ({ list_id, field_label, field_type, field_default, field_max, isTableExists }) => {
  // Limit the DB operation
  if (_.isNull(isTableExists)) {
    isTableExists = await listsFieldsTableExists({ list_id })
  }

  let sql = `CREATE TABLE x_leads_custom_${list_id} (lead_id INT(9) UNSIGNED PRIMARY KEY NOT NULL, ${field_label}`
  if (isTableExists) {
    sql = `ALTER TABLE x_leads_custom_${list_id} ADD \`${field_label}\``
  }

  if (field_type === 'DATE' || field_type === 'DATEPICKER') {
    sql += ' DATE'
  } else if (field_type === 'TIMEPICKER') {
    sql += ' TIME'
  } else if (field_type === 'AREA' || field_type === 'TEXTAREA') {
    sql += ' TEXT'
  } else {
    if (parseInt(field_max) > 8000) {
      field_max = '8000'
    }
    sql += ` VARCHAR(${field_max})`
    if (field_default !== 'NULL') {
      sql += ` DEFAULT '${field_default}'`
    }
  }

  if (isTableExists) {
    sql += ';'
  } else {
    sql += ') ENGINE=MyISAM DEFAULT CHARSET=utf8;'
  }

  if (field_type !== 'DISPLAY' && field_type !== 'SCRIPT') {
    await SqlHelper.runQuery({ query: sql })
  }
}
