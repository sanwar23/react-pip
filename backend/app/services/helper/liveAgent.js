import { USER_LEVEL } from '../../services/user/getSecurityContext'
import { executeSelectQuery, executeUpdateQuery } from '../../utils/queryManager'
import { LiveAgent, XLogInbound } from '../../db/models'
import { getFirstElement } from './index'

export const LIVE_AGENT_STATUS = {
  READY: 'READY',
  QUEUE: 'QUEUE',
  INCALL: 'INCALL',
  PAUSED: 'PAUSED',
  CLOSER: 'CLOSER',
  MQUEUE: 'MQUEUE'
}

export const getLiveAgentByUser = async ({ user, clients }) => {
  const sourceTable = getLiveAgentsTableName({ user, clients })
  const liveAgent = await executeSelectQuery({
    method: 'getDataByColumnName',
    sourceTable,
    columnName: 'user',
    columnValue: user.user
  })

  return getFirstElement(liveAgent)
}

export const getLiveAgentsTableName = ({ user, clients }) => {
  if (user.user_level < USER_LEVEL.SYSTEM) {
    return getLiveAgentsTableNameByClient({ client_username: clients[0].client_username, client_id: clients[0].client_id })
  } else {
    return 'x_live_agents_qubicles_1'
  }
}

export function getLiveAgentsTableNameByClient ({ client_username, client_id }) {
  return `x_live_agents_${client_username}_${client_id}`
}

export const updateLiveAgent = async ({ liveAgent, user, clients }) => {
  const sourceTable = getLiveAgentsTableName({ liveAgent, user, clients })
  await executeUpdateQuery({
    method: 'update',
    sourceTable,
    model: LiveAgent,
    data: liveAgent
  })
}

export const getAgentInboundCallLogByUniqueId = ({ uniqueid, user }) => {
  return XLogInbound.findOne({ where: { user, uniqueid }, raw: true })
}
