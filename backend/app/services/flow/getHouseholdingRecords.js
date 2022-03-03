import ServiceBase from '../../common/serviceBase'
import {
  getUserById,
  getLeadByLeadId,
  getListByListId,
  getListsByCampaignId,
  getLeadCustomDataByColumnName,
  getCampaignStatusesByCampaignId,
  flatArray
} from '../helper'
import GetClientsService from '../user/getClients'
import _ from 'lodash'

const constraints = {
  leadId: {
    presence: false
  },
  listId: {
    presence: false
  },
  userId: {
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

export class GetHouseholdingRecordsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let householdLeads = []

    if (this.userId) {
      const currentUser = await getUserById({ user_id: this.userId })
      const { clients } = await GetClientsService.run({ user_id: this.userId })

      let leads = []
      let promises = []
      const list = await getListByListId({ list_id: this.listId })

      if (this.lookupScope === 'LIST') {
        const customLead = await getLeadCustomDataByColumnName({
          list_id: this.listId,
          columnName: this.lookupFieldName,
          columnValue: this.lookupFieldValue,
          user: currentUser,
          clients
        })

        if (!_.isEmpty(customLead)) {
          leads = [...customLead]
        }
      } else if (this.lookupScope === 'CAMPAIGN') {
        const campaignLists = await getListsByCampaignId({ campaign_id: list.campaign_id })

        campaignLists.forEach((listdata) => {
          promises.push(() => getLeadCustomDataByColumnName({
            list_id: listdata.list_id,
            columnName: this.lookupFieldName,
            columnValue: this.lookupFieldValue,
            user: currentUser,
            clients
          }))
        })

        const data = await Promise.all(promises.map((promise) => promise()))
        if (data && data.length) {
          leads = [...leads, ...(flatArray(data))]
        }
      } else if (this.lookupScope === 'SYSTEM') {
        // TODO:
      }

      if (list) {
        const allCampStatuses = await getCampaignStatusesByCampaignId({
          campaign_id: list.campaign_id,
          extraQueryAttributes: { order: [['status_name', 'ASC']] }
        })

        promises = []

        if (leads && leads.length) {
          leads.forEach((customLead) => {
            promises.push(() => this.addHouseholdLeads({ customLead, allCampStatuses, user: currentUser, clients }))
          })

          const promiseResponse = await Promise.all(promises.map((promise) => promise()))
          // Filtering the null values
          householdLeads = _.compact(promiseResponse)
        }
      }
    }

    if (!householdLeads.length) {
      householdLeads.push({
        leadId: 0,
        firstName: 'There are no other related records in the system.'
      })
    }

    return householdLeads
  }

  async addHouseholdLeads ({ customLead, allCampStatuses, user, clients }) {
    const leadStandardRecord = await getLeadByLeadId({ lead_id: customLead.lead_id, user, clients })
    let finalDispo
    const householdLeadDispo = []
    let householdLead

    // The below loop is used for optimizing the re-iteration
    // https://github.com/qubicles/manager/blob/master/FC2.Web/Controllers/FlowController.cs#L1344
    // https://github.com/qubicles/manager/blob/master/FC2.Web/Controllers/FlowController.cs#L1356

    // make sure dispo isnt final
    allCampStatuses.forEach((s) => {
      if (s.unworkable === 'Y') {
        if ((s.status.toLowerCase() === leadStandardRecord.status.toLowerCase()) && !finalDispo) {
          finalDispo = s
        }
        householdLeadDispo.push(s)
      }
    })

    // ok to add
    if (!finalDispo || leadStandardRecord.status === 'NEW') {
      householdLead = {}
      householdLead.leadId = customLead.lead_id

      // we need to allow users to dispo each one of these using a final disp
      householdLead.dispos = householdLeadDispo

      if (_.has(customLead, 'contact_first_name')) {
        householdLead.firstName = customLead['contact_first_name']
      }
      if (_.has(customLead, 'contact_first')) {
        householdLead.firstName = customLead['contact_first']
      }
      if (_.has(customLead, 'contact_fname')) {
        householdLead.firstName = customLead['contact_fname']
      }
      if (_.has(customLead, 'first_name')) {
        householdLead.firstName = customLead['first_name']
      }
      if (_.has(customLead, 'fname')) {
        householdLead.firstName = customLead['fname']
      }
      if (_.has(customLead, 'f_name')) {
        householdLead.firstName = customLead['f_name']
      }
      if (!householdLead.firstName) {
        householdLead.firstName = leadStandardRecord.first_name
      }

      if (_.has(customLead, 'contact_last_name')) {
        householdLead.lastName = customLead['contact_last_name']
      }
      if (_.has(customLead, 'contact_last')) {
        householdLead.lastName = customLead['contact_last']
      }
      if (_.has(customLead, 'contact_lname')) {
        householdLead.lastName = customLead['contact_lname']
      }
      if (_.has(customLead, 'last_name')) {
        householdLead.lastName = customLead['last_name']
      }
      if (_.has(customLead, 'lastname')) {
        householdLead.lastName = customLead['lastname']
      }
      if (_.has(customLead, 'lname')) {
        householdLead.lastName = customLead['lname']
      }
      if (_.has(customLead, 'l_name')) {
        householdLead.lastName = customLead['l_name']
      }
      if (!householdLead.lastName) {
        householdLead.lastName = leadStandardRecord.last_name
      }

      if (_.has(customLead, 'company')) {
        householdLead.company = customLead['company']
      }
      if (_.has(customLead, 'companyname')) {
        householdLead.company = customLead['companyname']
      }
      if (_.has(customLead, 'company_name')) {
        householdLead.company = customLead['company_name']
      }

      if (_.has(customLead, 'contact_phone')) {
        householdLead.phoneNumber = customLead['contact_phone']
      }
      if (_.has(customLead, 'contactphone')) {
        householdLead.phoneNumber = customLead['contactphone']
      }
      if (_.has(customLead, 'phone')) {
        householdLead.phoneNumber = customLead['phone']
      }
      if (_.has(customLead, 'phonenumber')) {
        householdLead.phoneNumber = customLead['phonenumber']
      }
      if (_.has(customLead, 'phone_number')) {
        householdLead.phoneNumber = customLead['phone_number']
      }
      if (_.has(customLead, 'phone_num')) {
        householdLead.phoneNumber = customLead['phone_num']
      }
      if (!householdLead.phoneNumber) {
        householdLead.phoneNumber = leadStandardRecord.phone_number
      }

      if (_.has(customLead, 'title')) {
        householdLead.title = customLead['title']
      }
      if (_.has(customLead, 'contact_title')) {
        householdLead.title = customLead['contact_title']
      }
      if (!householdLead.title) {
        householdLead.title = leadStandardRecord.title
      }
    }

    return householdLead
  }
}
