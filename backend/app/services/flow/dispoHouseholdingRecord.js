import ServiceBase from '../../common/serviceBase'
import {
  getUserById,
  getLeadByLeadId,
  getListByListId,
  getListsByCampaignId,
  updateLead,
  deleteLeadFromLeadQueue,
  flatArray,
  getLeadCustomDataByColumnName
} from '../helper'
import GetClientsService from '../user/getClients'
import _ from 'lodash'

const constraints = {
  leadId: {
    presence: false
  },
  userId: {
    presence: false
  },
  flowLeadId: {
    presence: false
  },
  status: {
    presence: false
  },
  dispoType: {
    presence: false
  },
  lookupFieldName: {
    presence: false
  },
  lookupFieldValue: {
    presence: false
  },
  lookupScope: {
    presence: false
  }
}

export class DispoHouseholdingRecordService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const currentUser = await getUserById({ user_id: this.userId })
    const { clients } = await GetClientsService.run({ user_id: this.userId })

    if (currentUser) {
      const lead = await getLeadByLeadId({ lead_id: this.leadId, user: currentUser, clients })

      if (this.dispoType === 'ALL') {
        let leads = []
        let promises = []

        if (this.lookupScope === 'LIST') {
          const leadCustomData = await getLeadCustomDataByColumnName({
            list_id: lead.list_id,
            columnName: this.lookupFieldName,
            columnValue: this.lookupFieldValue,
            user: currentUser,
            clients
          })

          if (!_.isEmpty(leadCustomData)) {
            leads = [...leadCustomData]
          }
        } else if (this.lookupScope === 'CAMPAIGN') {
          const list = await getListByListId({ list_id: lead.list_id })
          const campaignLists = await getListsByCampaignId({ campaign_id: list.campaign_id })

          if (campaignLists && campaignLists.length) {
            campaignLists.forEach((listdata) => {
              promises.push(() => getLeadCustomDataByColumnName({
                list_id: listdata.list_id,
                columnName: this.lookupFieldName,
                columnValue: this.lookupFieldValue,
                user: currentUser,
                clients
              }))
            })

            const customData = await Promise.all(promises.map((promise) => promise()))
            if (customData && customData.length) {
              leads = [...leads, ...(flatArray(customData))]
            }
          }

          promises = []
        }

        leads.forEach((customLead) => {
          if (customLead.lead_id !== this.flowLeadId) {
            promises.push(() => this.updateRecord({
              customLead,
              clients,
              status: this.status,
              user: currentUser
            }))
          }
        })

        await Promise.all(promises.map((promise) => promise()))
      } else {
        // dispo a single lead at a time
        if (lead) {
          await this.updateAndDeleteLead({
            lead,
            lead_id: lead.lead_id,
            user: currentUser,
            clients,
            status: this.status
          })
        }
      }
    }

    // Default success message will be sent
    return true
  }

  async updateRecord ({ customLead, status, user, clients }) {
    const otherRecord = await getLeadByLeadId({ lead_id: customLead.lead_id, user, clients })
    if (otherRecord) {
      await this.updateAndDeleteLead({
        lead: otherRecord,
        lead_id: otherRecord.lead_id,
        user,
        clients,
        status
      })
    }
  }

  async updateAndDeleteLead ({ lead, lead_id, user, clients, status }) {
    const currentDate = new Date()
    lead.status = status
    lead.user = user.user
    lead.modify_date = currentDate
    lead.last_local_call_time = currentDate
    await updateLead({ lead, user, clients })
    await deleteLeadFromLeadQueue({ lead_id, user, clients })
  }
}
