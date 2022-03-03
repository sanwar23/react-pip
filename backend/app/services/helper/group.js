import { getCampaignById } from './campaign'
import { executeSelectQuery } from '../../utils/queryManager'
import { XInboundGroup } from '../../db/models'
import { splitCombinedFieldValuesForGroup } from './common'
import { USER_LEVEL } from '../user/getSecurityContext'
import _ from 'lodash'

export const parseInboundGroupsFromField = async ({ inboundGroupsFieldValue, clientIngroups }) => {
  const inboundGroups = []
  const inboundGroupIDs = splitCombinedFieldValuesForGroup(inboundGroupsFieldValue)
  // For optimized filtering, we're regenerating the 'clientIngroups' array by key 'group_id'
  // For example:
  // clientIngroups = [
  //  { group_id: 1, hold_time_option_minimum: 0, ..otherFields},
  //  { group_id: 2, hold_time_option_minimum: 0, ..otherFields}
  // ]
  // After keyBy method,
  // clientIngroupsByIds = {
  //  1: [{group_id: 1, hold_time_option_minimum: 0, ..otherFields}]
  //  2: [{group_id: 2, hold_time_option_minimum: 0, ..otherFields}]
  // }
  const clientIngroupsByIds = _.groupBy(clientIngroups, (data) => data.group_id.toLowerCase())

  if (inboundGroupIDs && inboundGroupIDs.length) {
    inboundGroupIDs.forEach((inboundGroup) => {
      if ((inboundGroup && inboundGroup.trim())) {
        inboundGroup = inboundGroup.toLowerCase()
        if (clientIngroupsByIds[inboundGroup] && clientIngroupsByIds[inboundGroup].length) {
          const isInboundGroupExist = inboundGroups.find((ig) => ig.group_id.toLowerCase() === inboundGroup.toLowerCase())
          if (!isInboundGroupExist) {
            const ibg = clientIngroupsByIds[inboundGroup]
            // We're adding the first element
            if (ibg && ibg.length) {
              inboundGroups.push(ibg[0])
            }
          }
        }
      }
    })
  }

  return inboundGroups
}

export const getInboundGroupsByClient = async ({ client_id }) => {
  const xInboundGroupData = await executeSelectQuery({
    method: 'getGroupsByClient',
    client_id: client_id,
    tableName: XInboundGroup.tableName
  })
  return xInboundGroupData
}

export const getXferInboundGroupsByCampaignData = async ({ campaign, clientIngroups }) => {
  const inboundGroupsFieldValue = campaign.xfer_groups
  return parseInboundGroupsFromField({ inboundGroupsFieldValue, clientIngroups })
}

export const getXferInboundGroups = async ({ campaign_id, clientIngroups }) => {
  const campaign = await getCampaignById({ campaign_id })
  return getXferInboundGroupsByCampaignData({ campaign, clientIngroups })
}

export const getInboundGroups = async ({ user, client_id }) => {
  let inboundGroups = []
  if (user.user_level < USER_LEVEL.SYSTEM) {
    inboundGroups = await getInboundGroupsByClient({ client_id })
  } else {
    inboundGroups = await XInboundGroup.findAll({ raw: true })
  }
  return inboundGroups
}

export const getInboundGroupsByUser = async ({ user, client_id, clientIngroups }) => {
  let inboundGroups = []
  if (user.user_level < USER_LEVEL.SYSTEM) {
    inboundGroups = parseInboundGroupsFromField({ inboundGroupsFieldValue: user.closer_campaigns, clientIngroups })
  } else {
    inboundGroups = await getInboundGroups({ user, client_id })
  }
  return inboundGroups
}

export const getInboundGroupById = async ({ group_id }) => {
  return executeSelectQuery({
    method: 'getDataByColumnName',
    sourceTable: XInboundGroup.tableName,
    columnName: 'group_id',
    columnValue: group_id
  })
}
