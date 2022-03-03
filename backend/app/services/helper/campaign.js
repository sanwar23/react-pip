import { Campaign, XCampaignStatus } from '../../db/models'
import { USER_LEVEL } from '../user/getSecurityContext'
import { executeSelectQuery } from '../../utils/queryManager'

export const getCampaignById = async ({ campaign_id }) => {
  const campaignData = await Campaign.findOne({ where: { campaign_id }, raw: true })
  return campaignData
}

export const getAllCampaigns = async () => {
  return Campaign.findAll({ raw: true })
}

export const getCampaignStatusesByCampaignId = async (queryObj) => {
  let query = { where: { campaign_id: queryObj['campaign_id'] }, raw: true }
  if (queryObj['extraQueryAttributes']) {
    query = { ...query, ...queryObj['extraQueryAttributes'] }
  }
  return XCampaignStatus.findAll(query)
}

export const getCampaignsByClientId = async ({ client_id }) => {
  const campaigns = await executeSelectQuery({
    method: 'getCampaignsByClientId',
    sourceTable: Campaign.tableName,
    client_id,
    orderByColumnName: 'campaign_name'
  })

  return campaigns
}

export const getCampaigns = async ({ user, clients, client_id }) => {
  if (user && clients.length > 0 && user.user_level < USER_LEVEL.SYSTEM) {
    return getCampaignsByClientId({ client_id })
  } else {
    return getAllCampaigns()
  }
}
