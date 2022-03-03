import ServiceBase from '../../common/serviceBase'
import {
  getListByListId,
  getCampaignStatusesByCampaignId,
  getCampaignById,
  getStatuses
} from '../helper'
import _ from 'lodash'

const constraints = {
  userId: {
    presence: false
  },
  listId: {
    presence: false
  },
  queueId: {
    presence: false
  }
}

export class GetDispositionsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const dispositions = []

    // Fetching list by listId
    const list = await getListByListId({ list_id: this.listId })

    if (list && list['list_id']) {
      let campaign_id = list.campaign_id
      if (this.queueId) {
        campaign_id = this.queueId
      }

      let allCampStatuses = await getCampaignStatusesByCampaignId({ campaign_id })
      // no IB dispos, pull from campaign
      if (this.queueId && !(allCampStatuses && allCampStatuses.length)) {
        allCampStatuses = await getCampaignStatusesByCampaignId({ campaign_id: list.campaign_id })
      }

      // if (allCampStatuses && allCampStatuses.length)
      const campStatuses = []
      const campIBStatuses = []

      allCampStatuses.forEach((campStatus) => {
        const statusObj = {
          status: campStatus.status,
          status_name: campStatus.status_name,
          category: campStatus.category
        }

        // outbound-only dispos
        if (campStatus.category === 'UNDEFINED' || !campStatus.category) {
          campStatuses.push({ ...statusObj, campaign_id: campStatus.campaign_id })
        } else {
          // inbound dispos
          campIBStatuses.push(statusObj)
        }
      })

      let mergedStatuses = []

      // do we need system dispositions as well?
      const campaign = await getCampaignById({ campaign_id: list.campaign_id })
      if (campaign && campaign.custom_status_only === 'N') {
        const systemStatuses = await getStatuses({ selectable: 'Y' })
        mergedStatuses = [...campStatuses, ...campIBStatuses, ...systemStatuses]
      } else {
        mergedStatuses = [...campStatuses, ...campIBStatuses]
      }

      mergedStatuses = _.orderBy(mergedStatuses, 'status_name', 'ASC')

      // a little formatting (extra wrk but helps user understand better)
      mergedStatuses.forEach((cs) => {
        let statusName = cs.status_name
        if (cs.category !== 'UNDEFINED') {
          // replacing value of cs.category globally with ''
          statusName = statusName.replace(new RegExp(cs.category, 'g'), '')
        }

        dispositions.push({
          status: cs.status,
          status_name: statusName
        })
      })
    }

    return _.orderBy(dispositions, 'status_name', 'ASC')
  }
}
