import ServiceBase from '../../common/serviceBase'
import {
  getUserById,
  getLiveAgentByUser,
  updateLiveAgent,
  getFlowPageByPageId,
  getLeadByLeadId,
  updateLead,
  getLeadCustomData,
  deleteLead,
  deleteLeadCustomData,
  getCampaigns,
  getLists,
  getContactOutboundCallLog,
  updateOutboundLog,
  getContactInboundCallLog,
  updateInboundLog,
  getFirstElement,
  getLeadByPhone,
  addListLead,
  getListByListId,
  getCampaignStatusesByCampaignId,
  addLeadToCustomTable,
  updateLeadInCustomTable,
  getEditableFlowFieldsByFlowId,
  getEmailTemplateByTemplateId,
  createDate
} from '../helper'

import getSecurityContext from '../user/getSecurityContext'
import moment from 'moment'
import _ from 'lodash'
import ical from 'ical-generator'
import NodeMailer from '../../utils/getNodeMailer'
import logger from '../../common/logger'

const constraints = {
  userId: {
    presence: { allowEmpty: false }
  },
  action: {
    presence: { allowEmpty: false }
  },
  value: {
    presence: false
  },
  leadData: {
    presence: false
  },
  leadId: {
    presence: false
  },
  pageId: {
    presence: false
  },
  goToPause: {
    presence: false
  }
}

export class PerformActionService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    // Get User by userId
    const user = await getUserById({ user_id: this.userId })
    const { clients, currentClientId } = await getSecurityContext.run({ user })

    switch (this.action) {
      case 'DISPOSITION': {
        const liveAgent = await getLiveAgentByUser({ user, clients })
        if (liveAgent) {
          liveAgent.external_hangup = '1'
          liveAgent.external_status = this.value
          liveAgent.external_timer_action_destination = 'Flow'

          if (this.goToPause) {
            liveAgent.external_pause = 'PAUSE'
          }

          await updateLiveAgent({ liveAgent, user, clients })

          // if this was a repeat contact, need to also dispo it as as default dispo sdr set on page
          if (this.leadId && this.pageId) {
            const page = await getFlowPageByPageId({ page_id: this.pageId })
            const lead = await getLeadByLeadId({ lead_id: this.leadId, user, clients })
            const customLead = await getLeadCustomData({ list_id: lead.list_id, lead_id: lead.lead_id })

            if (this.isValidLead(customLead)) {
              const sysRepeatNew = customLead['sys_repeat_new']
              const sysRepeatExisting = customLead['sys_repeat_existing']

              if (sysRepeatNew === 'true' || sysRepeatExisting === 'true') {
                lead.status = page.default_disposition_sdr
                lead.modify_date = new Date()
                await updateLead({ lead, user, clients })
              }
            }
          } else if (this.leadId) {
            // if this was a repeat contact and we got here, this is not a valid SDR...delete it
            const lead = await getLeadByLeadId({ lead_id: this.leadId, user, clients })
            const customLead = await getLeadCustomData({ list_id: lead.list_id, lead_id: lead.lead_id })

            if (this.isValidLead(customLead)) {
              const sysRepeatNew = customLead['sys_repeat_new']
              const sysRepeatExisting = customLead['sys_repeat_existing']

              if (sysRepeatNew === 'true' || sysRepeatExisting === 'true') {
                await deleteLead({ lead, user, clients })
                if (sysRepeatNew === 'true') {
                  await deleteLeadCustomData({ list_id: lead.list_id, lead_id: lead.lead_id })
                }
              }
            }
          }
        } else if (this.leadId && this.value) {
          const lead = await getLeadByLeadId({ lead_id: this.leadId, user, clients })
          if (lead) {
            lead.status = this.value
            lead.modify_date = new Date()
            await updateLead({ lead })

            // full day's range from last call time to make sure we update the very last call log(s) for this lead
            const callStart = moment(lead.last_local_call_time.Value).add(-1, 'day')
            const callEnd = moment(lead.last_local_call_time.Value).add(1, 'day')

            // Since in both the below methods i.e getContactOutboundCallLog
            // & getContactInboundCallLog we need campaigns and lists.
            // So for reducing the database query fetching, we're fetching the
            // respective details in the service.

            const campaigns = await getCampaigns({ user, clients, client_id: currentClientId })
            const lists = await getLists({ campaigns })

            // change the disposition on the call logs (in/out) as well
            const lastOBLogs = await getContactOutboundCallLog({
              lead_id: lead.lead_id,
              startDate: callStart,
              endDate: callEnd,
              user,
              clients,
              client_id: currentClientId,
              campaigns,
              lists
            })

            const OBLog = getFirstElement(lastOBLogs)

            if (OBLog) {
              OBLog.status = this.value
              await updateOutboundLog({ log: OBLog, user, clients })
            }

            const lastIBLogs = await getContactInboundCallLog({
              lead_id: lead.lead_id,
              startDate: callStart,
              endDate: callEnd,
              user,
              clients,
              client_id: currentClientId,
              campaigns,
              lists
            })

            const IBLog = getFirstElement(lastIBLogs)

            if (IBLog) {
              IBLog.status = this.value
              await updateInboundLog({ log: IBLog, user, clients })
            }
          }
        }
        break
      }

      case 'ENDCALL': {
        const liveAgent = await getLiveAgentByUser({ user, clients })
        if (liveAgent) {
          liveAgent.external_hangup = this.value
          await updateLiveAgent({ liveAgent, user, clients })
        }
        break
      }

      case 'SENDDTMF': {
        const liveAgent = await getLiveAgentByUser({ user, clients })
        if (liveAgent) {
          liveAgent.external_dtmf = this.value
          await updateLiveAgent({ liveAgent, user, clients })
        }
        break
      }

      case 'HANGUP_XFER':
      case 'HANGUP_BOTH':
      case 'LEAVE_3WAY_CALL': {
        const liveAgent = await getLiveAgentByUser({ user, clients })
        if (liveAgent) {
          liveAgent.external_transferconf = `${this.action}------------`
          await updateLiveAgent({ liveAgent, user, clients })
        }
        break
      }

      case 'XFERCALL': {
        const liveAgent = await getLiveAgentByUser({ user, clients })
        if (liveAgent) {
          const xferOpts = this.value && this.value.split('~')
          switch (xferOpts[0]) {
            case 'BlindXfer':
              xferOpts[0] = 'BLIND_TRANSFER'
              break
            case 'InternalXfer':
              xferOpts[0] = 'LOCAL_CLOSER'
              break
            case 'WarmXfer':
              xferOpts[0] = 'DIAL_WITH_CUSTOMER'
              break
            case 'HoldDialXfer':
              xferOpts[0] = 'PARK_CUSTOMER_DIAL'
              break
          }

          liveAgent.external_transferconf = `${xferOpts[0]}---${xferOpts[2]}---${xferOpts[1]}---NO---`
          await updateLiveAgent({ liveAgent, user, clients })
        }
        break
      }

      case 'NEWLEAD': {
        const existingLeadId = parseInt(this.leadId)
        if (existingLeadId > 0) {
          // get our current lead
          let lead = await getLeadByLeadId({ lead_id: existingLeadId, user, clients })
          if (lead) {
            // find matching phone numbers
            const records = await getLeadByPhone({ phone_number: lead.phone_number, user, clients })

            const allRecords = []
            const leadRecords = []

            // The below loop is used for optimizing the re-iteration
            // https://github.com/qubicles/manager/blob/master/FC2.Web/Controllers/FlowController.cs#L728
            // https://github.com/qubicles/manager/blob/master/FC2.Web/Controllers/FlowController.cs#L738
            // https://github.com/qubicles/manager/blob/master/FC2.Web/Controllers/FlowController.cs#L753

            records.forEach((record) => {
              if (record.list_id === lead.list_id) {
                allRecords.push(record)
                // do we have any other records that doesn't match the current lead?
                if (record.lead_id !== lead.lead_id) {
                  leadRecords.push(record)
                }
              }
            })

            // find the campaign associated with the list
            const leadList = await getListByListId({ list_id: lead.list_id })
            let isNewLead = true

            if (leadList) {
              if (leadRecords.length > 0) {
                // get our list of non-finalized dispositions and match the leads against those
                const callableStatuses = await getCampaignStatusesByCampaignId({ campaign_id: leadList.campaign_id })
                  .filter(status => (!status.category || status.category === 'UNDEFINED') && status.unworkable === 'N')
                  .map((s) => s.status)

                // add system NEW as callable
                callableStatuses.push('NEW')
                callableStatuses.push('AA')
                callableStatuses.push('A')
                callableStatuses.push('NA')
                callableStatuses.push('N')

                // do we have one of these leads in a call-able disposition status?
                const callableLead = leadRecords.find((record) => callableStatuses.includes(record.status))

                if (callableLead) {
                  isNewLead = false
                  lead = callableLead
                }
              }

              const customLead = this.leadData

              if (isNewLead) {
                // save our new lead, copying standard data as well
                if (!lead.vendor_lead_code) {
                  lead.vendor_lead_code = ''
                }

                lead.vendor_lead_code = `${lead.vendor_lead_code}_2`

                lead.lead_id = 0
                lead.entry_date = new Date()
                lead.modify_date = new Date()
                await addListLead({ lead, user, clients, client_id: currentClientId })

                // save custom data to new lead's record
                await addLeadToCustomTable({ list_id: lead.list_id, lead_id: lead.lead_id })
              }

              customLead['lead_id'] = lead.lead_id

              // system contact fields supported for creating new contacts
              const spokeToFirstName = 'SpokeToFirstName'
              const spokeToLastName = 'SpokeToLastName'
              const spokeToTitle = 'SpokeToTitle'
              const ogFirstName = 'og_fname'
              const ogLastName = 'og_lname'
              const ogTitle = 'og_title'
              const firstName = 'FirstName'
              const lastName = 'LastName'
              const title = 'Title'
              const fName = 'fname'
              const lName = 'lname'
              const lCTitle = 'title'
              const newFirstName = 'NewFirstName'
              const newLastName = 'NewLastName'
              const newTitle = 'NewTitle'

              // change some fields, if present, to indicate second lead
              // any spoke tos?
              if (_.has(customLead, spokeToFirstName)) {
                let newValue = customLead[spokeToFirstName]
                if (_.has(customLead, firstName)) {
                  newValue = customLead[firstName]
                } else if (_.has(customLead, fName)) {
                  newValue = customLead[fName]
                }

                customLead[spokeToFirstName] = newValue
              }

              if (_.has(customLead, spokeToLastName)) {
                let newValue = customLead[spokeToLastName]
                if (_.has(customLead, lastName)) {
                  newValue = customLead[lastName]
                } else if (_.has(customLead, lName)) {
                  newValue = customLead[lName]
                }

                customLead[spokeToLastName] = newValue
              }

              if (_.has(customLead, spokeToTitle)) {
                let newValue = customLead[spokeToTitle]
                if (_.has(customLead, title)) {
                  newValue = customLead[title]
                } else if (_.has(customLead, lCTitle)) {
                  newValue = customLead[lCTitle]
                }

                customLead[spokeToTitle] = newValue
              }

              if (_.has(customLead, ogFirstName)) {
                let newValue = customLead[ogFirstName]
                if (_.has(customLead, firstName)) {
                  newValue = customLead[firstName]
                } else if (_.has(customLead, fName)) {
                  newValue = customLead[fName]
                }

                customLead[ogFirstName] = newValue
              }

              if (_.has(customLead, ogLastName)) {
                let newValue = customLead[ogLastName]
                if (_.has(customLead, lastName)) {
                  newValue = customLead[lastName]
                } else if (_.has(customLead, lName)) {
                  newValue = customLead[lName]
                }

                customLead[ogLastName] = newValue
              }

              if (_.has(customLead, ogTitle)) {
                let newValue = customLead[ogTitle]
                if (_.has(customLead, title)) {
                  newValue = customLead[title]
                } else if (_.has(customLead, lCTitle)) {
                  newValue = customLead[lCTitle]
                }

                customLead[ogTitle] = newValue
              }

              // clear out
              if (_.has(customLead, firstName)) {
                customLead[firstName] = ''
              }

              if (_.has(customLead, lastName)) {
                customLead[lastName] = ''
              }

              if (_.has(customLead, title)) {
                customLead[title] = ''
              }

              if (_.has(customLead, fName)) {
                customLead[fName] = ''
              }

              if (_.has(customLead, lName)) {
                customLead[lName] = ''
              }

              if (_.has(customLead, lCTitle)) {
                customLead[lCTitle] = ''
              }

              if (_.has(customLead, newFirstName)) {
                customLead[newFirstName] = ''
              }

              if (_.has(customLead, newLastName)) {
                customLead[newLastName] = ''
              }

              if (_.has(customLead, newTitle)) {
                customLead[newTitle] = ''
              }

              // let's clear any data that isn't set to copy on existing contact
              const flowFields = await getEditableFlowFieldsByFlowId({ flow_id: leadList.flow_id })
              flowFields.forEach((field) => {
                // we use the unused goto_field to track whether to
                // copy on Repeat Contact to avoid recreating table structure
                if (!(field.goto_field === 'True')) {
                  if (_.has(customLead, field.field_label)) {
                    customLead[field.field_label] = ''
                  }
                }
              })

              await updateLeadInCustomTable({ lead: customLead })

              return {
                leadId: lead.lead_id,
                isNewLead
              }
            }
          }
        }

        break
      }

      case 'SENDEMAIL': {
        if (this.value && this.leadId) {
          // possible email opts: 0=templateId; 1=appt date; 2=appt time; 3=reply-to
          const emailOptions = this.value.split('~')
          const emailTemplate = await getEmailTemplateByTemplateId({ email_template_id: emailOptions[0] })

          const customLead = this.leadData
          if (customLead && emailTemplate.body) {
            let emailBody = emailTemplate.body
            let emailAddress = ''
            let gmtOffset = '-5.00'

            for (const fieldName in customLead) {
              let variableName = `@${fieldName}@`
              if (!emailBody.includes(variableName)) {
                variableName = `@${fieldName} `
              }

              const customLeadFieldValue = customLead[fieldName]
              const fieldNameInLowerCase = fieldName.toLowerCase()

              if (emailBody.includes(variableName)) {
                try {
                  emailBody = emailBody.replace(new RegExp(variableName, 'g'), customLeadFieldValue)
                } catch (Error) { // simply remove var
                  emailBody = emailBody.replace(new RegExp(variableName, 'g'), '')
                }
              }

              const isValidEmailField = fieldNameInLowerCase === 'email' ||
                                        fieldNameInLowerCase === 'emailaddress' ||
                                        fieldNameInLowerCase === 'email_address'

              // check for email address
              if (isValidEmailField && customLeadFieldValue && !emailAddress) {
                emailAddress = customLeadFieldValue
              }

              // check for gmt offset
              if (fieldNameInLowerCase === 'gmt_offset_now' && customLeadFieldValue) {
                gmtOffset = customLeadFieldValue
              }
            }

            // if template has an email address, use that!
            if (emailTemplate.toAddress) {
              emailAddress = emailTemplate.toAddress
            }

            // let's connect and submit!
            if (emailAddress) {
              // do we have an appt date and/or time? if so, prepare ics attachment
              let icsCalendar = false
              const cal = ical()
              if (emailOptions && emailOptions.length === 3) {
                const apptDateString = emailOptions[1]
                const apptTimeString = emailOptions[2]

                let apptDate, apptTime

                if (apptDateString && apptDateString !== 'undefined') {
                  apptDate = new Date(apptDateString)
                }

                if (apptTimeString && apptTimeString !== 'undefined') {
                  apptTime = new Date(apptTimeString)
                }

                // if valid, build ics!
                if (apptDate && apptTime) {
                  const apptStartDate = createDate({
                    year: apptDate.getFullYear(),
                    month: apptDate.getMonth(),
                    day: apptDate.getDate(),
                    hours: apptTime.getHours(),
                    minutes: apptTime.getMinutes(),
                    seconds: apptTime.getSeconds()
                  })

                  const apptEndDate = moment(apptStartDate).add(1, 'hour')

                  // timezone
                  const currentTimezone = moment().tz('America/New_York')
                  const isDaylightSavings = currentTimezone.isDST()

                  let offset = parseFloat(gmtOffset)
                  if (isDaylightSavings) {
                    offset = offset + 1
                  }

                  cal.createEvent({
                    domain: 'messenger.qubicles.io',
                    start: moment(apptStartDate),
                    end: moment(apptEndDate),
                    summary: emailTemplate.subject
                  })

                  // Reference link: https://github.com/sebbo2002/ical-generator
                  switch (offset.toFixed(2)) {
                    case '-10.00':
                      cal.timezone('US/Samoa')
                      break
                    case '-9.00':
                      cal.timezone('US/Hawaii')
                      break
                    case '-8.00':
                      cal.timezone('US/Alaska')
                      break
                    case '-7.00':
                      cal.timezone('US/Pacific')
                      break
                    case '-6.00':
                      cal.timezone('US/Mountain')
                      break
                    case '-5.00':
                      cal.timezone('US/Central')
                      break
                    case '-4.00':
                      cal.timezone('US/Eastern')
                      break
                    case '-3.50':
                      cal.timezone('America/St_Johns')
                      break
                    case '-3.00':
                      cal.timezone('America/Argentina/Buenos_Aires')
                      break
                    case '-2.00':
                      cal.timezone('Etc/GMT+2')
                      break
                    case '-1.00':
                      cal.timezone('Atlantic/Cape_Verde')
                      break
                    case '0.00':
                      cal.timezone('Etc/UTC')
                      break
                    case '1.00':
                      cal.timezone('Europe/Berlin')
                      break
                    case '2.00':
                      cal.timezone('Asia/Beirut')
                      break
                    case '3.00':
                      cal.timezone('Asia/Baghdad')
                      break
                    case '3.50':
                      cal.timezone('Asia/Tehran')
                      break
                    case '4.00':
                      cal.timezone('Asia/Dubai')
                      break
                    case '4.50':
                      cal.timezone('Asia/Kabul')
                      break
                    case '5.00':
                      cal.timezone('Asia/Karachi')
                      break
                    case '5.50':
                      cal.timezone('Asia/Kolkata')
                      break
                    case '5.75':
                      cal.timezone('Asia/Kathmandu')
                      break
                    case '6.00':
                      cal.timezone('Asia/Dhaka')
                      break
                    case '7.00':
                      cal.timezone('Asia/Jakarta')
                      break
                    case '8.00':
                      cal.timezone('Asia/Shanghai')
                      break
                    case '9.00':
                      cal.timezone('Asia/Tokyo')
                      break
                    default:
                      cal.timezone('America/New_York')
                      break
                  }

                  icsCalendar = true
                }
              }

              // check which from address to use
              let fromAddress = emailTemplate.fromAddress
              if (emailOptions && emailOptions.length === 4 && emailOptions[3] && emailOptions[3] === 'USER' && user.email) {
                fromAddress = user.email
              }

              const emailObj = {
                from: fromAddress,
                to: emailAddress,
                subject: emailTemplate.subject,
                html: emailBody
              }

              if (emailTemplate.cc) {
                emailObj['cc'] = emailTemplate.cc
              }

              if (icsCalendar) {
                emailObj['attachments'] = [{
                  // utf-8 string as an attachment
                  filename: 'invite.ics',
                  content: cal.toString()
                }]
              }

              try {
                const info = await NodeMailer.sendMail(emailObj)
                logger.info(`Email sent succesfully!! => ${JSON.stringify(info)}`)
              } catch (error) {
                logger.error(`Error in sending mail: ${error}`)
              }
            }
          }
        }

        break
      }
    }

    return {
      leadId: 0,
      isNewLead: true
    }
  }

  isValidLead (lead) {
    return _.has(lead, 'sys_repeat_new') && _.has(lead, 'sys_repeat_existing')
  }
}
