import ServiceBase from '../../../common/serviceBase'
import { getErrorMessageForService } from '../../helper'
import logger from '../../../common/logger'
import { ERRORS } from '../../../utils/errors'
import {
  fetchAgentJobApplicationList, getUserIdByClientIds, getClientProfilePictures
} from '../../helper/jobApplication'
import _ from 'lodash'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  agent_user_id: {
    presence: { allowEmpty: false }
  },
  limit: {
    presence: { allowEmpty: false }
  },
  offset: {
    presence: { allowEmpty: false }
  },
  statusTypes: {
    presence: { allowEmpty: false }
  }
}

export class PeopleFetchJobApplicationsByAgentService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { agent_user_id, limit, offset, statusTypes } = this.filteredArgs
    try {
      let { applications, more } = await fetchAgentJobApplicationList({
        agentUserId: Number(agent_user_id),
        // Setting limit & offset to positive default values
        offset: Number(offset) < 0 ? 0 : Number(offset),
        limit: Number(limit) < 0 ? 2 : Number(limit),
        statusTypes
      })

      const clientIds = applications && _.uniq(applications.map((application) => application.client_id))

      if (clientIds && clientIds.length) {
        const userData = await getUserIdByClientIds({ clientIds })

        if (userData && userData.length) {
          const clientProfilePictures = await getClientProfilePictures({
            userIds: userData.map((item) => item.user_id)
          })

          applications = applications.map((application) => {
            const clientUserId = userData.find((item) => item.client_id === application.client_id)
            const clientData = clientUserId && clientProfilePictures.find((item) => item.user_id === clientUserId.user_id)
            const profilePicture = clientData && clientData.profile_image

            return {
              ...application,
              profilePicture,
              clientUserId: clientUserId.user_id
            }
          })
        }
      }

      return { applications, more }
    } catch (err) {
      logger.error(getErrorMessageForService('PeopleFetchJobApplicationsByAgentService'), err)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
