import ServiceBase from '../../common/serviceBase'
import { Flow } from '../../db/models'
import { USER_LEVEL } from '../user/getSecurityContext'
import GetClientsService from '../user/getClients'
import {
  getUserById,
  getLeadByLeadId,
  getFirstElement,
  getFlowByFlowId,
  addListLead,
  getListByListId,
  getLiveAgentByUser,
  getLeadCustomData,
  getCampaignById,
  addLeadToCustomTable,
  getAgentInboundCallLogByUniqueId,
  getInboundGroupById,
  getLiveRecordingLog,
  updateEntity,
  syncListsFieldsWithFlow,
  fixDigits,
  addFlowLog,
  expandoObject,
  getAgentDIDCallLog
} from '../helper'
import { ERRORS } from '../../utils/errors'
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
  flowId: {
    presence: false
  },
  isPreview: {
    presence: false
  }
}

export class GetLeadService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const currentUser = await getUserById({ user_id: this.userId })
    let customLead = {}
    if (currentUser) {
      const { clients } = await GetClientsService.run({ user_id: this.userId })
      const currentDate = new Date()
      let standardLead = await getLeadByLeadId({ lead_id: this.leadId, user: currentUser, clients })
      // if our Flow changed while we were live, make sure we sync schemas before continuing
      const flow = await getFlowByFlowId({ flow_id: this.flowId })

      // Make sure flow/user combination belongs to client
      const client = getFirstElement(clients)

      if (flow.client_id !== client.client_id && currentUser.user_level !== USER_LEVEL.SYSTEM) {
        this.addError(ERRORS.UNAUTHORIZED)
        return
      }

      if (flow.flow_changed === 'Y') {
        flow.flow_changed = 'N'
        await updateEntity({ model: Flow, data: flow })
        await syncListsFieldsWithFlow({ list_id: this.listId, flow_id: this.flowId, createIfNotExists: false })
      }

      if (!standardLead) {
        standardLead = {
          entry_date: currentDate,
          modify_date: currentDate,
          status: 'NEW',
          user: currentUser.user,
          vendor_lead_code: '',
          source_id: '',
          list_id: this.listId,
          gmt_offset_now: -4,
          called_since_last_reset: 'N',
          phone_code: '1',
          phone_number: '',
          title: '',
          first_name: '',
          middle_initial: '',
          last_name: '',
          address1: '',
          address2: '',
          address3: '',
          city: '',
          state: '',
          postal_code: '',
          country_code: 'USA',
          gender: '',
          alt_phone: '',
          email: '',
          security_phrase: '',
          comments: '',
          called_count: 1,
          last_local_call_time: currentDate,
          rank: 0,
          owner: '',
          entry_list_id: this.listId
        }

        if (!this.isPreview) {
          await addListLead({ lead: standardLead, user: currentUser, clients, client_id: client.client_id })

          // add custom entry as well
          await addLeadToCustomTable({ list_id: this.listId, lead_id: standardLead.lead_id })
        }
      }

      if (standardLead && standardLead.lead_id > 0) {
        customLead = await getLeadCustomData({ list_id: this.listId, lead_id: standardLead.lead_id })

        customLead.lead_id = standardLead.lead_id
        customLead.entry_date = standardLead.entry_date
        customLead.modify_date = standardLead.modify_date
        customLead.status = standardLead.status
        customLead.user = standardLead.user
        customLead.vendor_lead_code = standardLead.vendor_lead_code
        customLead.source_id = standardLead.source_id
        customLead.list_id = standardLead.list_id
        customLead.gmt_offset_now = standardLead.gmt_offset_now
        customLead.called_since_last_reset = standardLead.called_since_last_reset
        customLead.phone_code = standardLead.phone_code
        customLead.phone_number = standardLead.phone_number

        if (!_.has(customLead, 'title')) {
          customLead.title = standardLead.title
        }
        if (!_.has(customLead, 'first_name')) {
          customLead.first_name = standardLead.first_name
        }
        if (!_.has(customLead, 'last_name')) {
          customLead.last_name = standardLead.last_name
        }
        if (!_.has(customLead, 'address1')) {
          customLead.address1 = standardLead.address1
        }
        if (!_.has(customLead, 'address2')) {
          customLead.address2 = standardLead.address2
        }
        if (!_.has(customLead, 'address3')) {
          customLead.address3 = standardLead.address3
        }
        if (!_.has(customLead, 'city')) {
          customLead.city = standardLead.city
        }
        if (!_.has(customLead, 'state')) {
          customLead.state = standardLead.state
        }
        if (!_.has(customLead, 'postal_code')) {
          customLead.postal_code = standardLead.postal_code
        }
        if (!_.has(customLead, 'country_code')) {
          customLead.country_code = standardLead.country_code
        }
        if (!_.has(customLead, 'gender')) {
          customLead.gender = standardLead.gender
        }
        if (!_.has(customLead, 'email')) {
          customLead.email = standardLead.email
        }
        if (!_.has(customLead, 'comments')) {
          customLead.comments = standardLead.comments
        }
        if (!_.has(customLead, 'alt_phone')) {
          customLead.alt_phone = standardLead.alt_phone
        }

        customLead.security_phrase = standardLead.security_phrase
        customLead.called_count = standardLead.called_count
        customLead.last_local_call_time = standardLead.last_local_call_time
        customLead.rank = standardLead.rank
        customLead.owner = standardLead.owner
        customLead.entry_list_id = standardLead.entry_list_id
      }

      // clear out previous vars, if any
      customLead.queue_id = ''
      customLead.queue_name = ''
      customLead.call_type = ''
      customLead.campaign_id = ''
      customLead.campaign_name = ''
      customLead.uniqueid = ''
      customLead.channel = ''
      customLead.recording_filename = ''
      customLead.list_name = ''

      const liveAgent = await getLiveAgentByUser({ user: currentUser, clients })

      if (liveAgent) {
        if (liveAgent.comments === 'INBOUND') {
          customLead.call_type = 'Inbound'

          if (liveAgent.uniqueid) {
            const log = await getAgentInboundCallLogByUniqueId({
              uniqueid: liveAgent.uniqueid,
              user: liveAgent.user
            })

            if (log) {
              customLead.queue_id = log.campaign_id
              if (log.campaign_id) {
                const queue = await getInboundGroupById({ group_id: log.campaign_id })
                if (queue) {
                  customLead.queue_name = queue.group_name
                }
              }
            }

            const didLog = await getAgentDIDCallLog({ uniqueid: liveAgent.uniqueid })

            if (didLog) {
              customLead.did_pattern = didLog.extension
              customLead.did_id = didLog.did_id
            }
          }
        } else {
          customLead.call_type = 'Outbound'
        }

        customLead.campaign_id = liveAgent.campaign_id
        const campaign = await getCampaignById({ campaign_id: liveAgent.campaign_id })
        if (campaign) {
          customLead.campaign_name = campaign.campaign_name
        }

        customLead.uniqueid = liveAgent.uniqueid
        customLead.channel = liveAgent.channel

        // get the recording log and pass in as variable
        if (liveAgent.lead_id > 0) {
          const recording = await getLiveRecordingLog({
            lead_id: liveAgent.lead_id,
            user: liveAgent.user
          })

          if (recording) {
            customLead.recording_filename = recording.filename
          }
        }
      }

      // other system properties scripts may find useful
      customLead.user_id = currentUser.user_id
      customLead.user = currentUser.user
      customLead.full_name = currentUser.full_name
      // flow name, description

      if (this.listId > 0) {
        const dialingList = await getListByListId({ list_id: this.listId })
        if (dialingList) {
          customLead.list_name = dialingList.list_name
        }

        // save interaction to DB
        const flowLog = {
          client_id: client.client_id,
          flow_id: this.flowId,
          lead_id: this.leadId,
          list_id: this.listId,
          call_date: currentDate,
          cost: fixDigits(client.flow_rate, 3),
          rate: fixDigits(client.flow_rate * 1, 3),
          user: currentUser.user
        }

        if (liveAgent) {
          flowLog.uniqueid = liveAgent.uniqueid
        }

        await addFlowLog({ log: flowLog })
      }
    }

    return expandoObject(customLead)
  }
}
