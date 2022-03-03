import ServiceBase from '../../../../common/serviceBase'
import {
  getAllJobs,
  getErrorMessageForService
} from '../../../helper'
import { getClientIdByUserId, getClientData } from '../../../helper/user'
import { ERRORS, MESSAGES } from '../../../../utils/errors'
import logger from '../../../../common/logger'
import _ from 'lodash'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  search_keyword: {
    presence: false
  },
  category_id: {
    presence: false
  },
  status: {
    presence: false
  },
  client_id: {
    presence: false
  },
  limit: {
    presence: false
  },
  offset: {
    presence: false
  }
}

export class JobsByCategoryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id, search_keyword, category_id, status, client_id, limit, offset } = this.filteredArgs
      let jobs = []
      if (client_id) {
        const clientData = await getClientData({ client_id })
        if (clientData && clientData.client_id) {
          jobs = await getAllJobs({ client_id: clientData.client_id, limit, offset, status })
        } else {
          this.addError(ERRORS.NOT_FOUND, MESSAGES.DATA_NOT_FOUND)
          return
        }
      } else {
        const client = await getClientIdByUserId({ user_id })
        if (client && client.client_id) {
          const rest = {
            category_id,
            search_keyword,
            status
          }
          jobs = await getAllJobs({ client_id: client.client_id, ...rest })
        }
      }
      return { jobs, isAllJobsFetched: _.isUndefined(limit) }
    } catch (e) {
      logger.error(`${getErrorMessageForService('JobsByCategoryService')} ${e}`)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
