import ServiceBase from '../../common/serviceBase'
import ActiveCampaign from './activeCampaign'
import logger from '../../common/logger'
import { getErrorMessageForService } from '../helper'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  email: {
    presence: { allowEmpty: false }
  },
  phone_number: {
    presence: { allowEmpty: false }
  },
  name: {
    presence: { allowEmpty: false }
  },
  list_id: {
    presence: { allowEmpty: false }
  },
  first_name: {
    presence: { allowEmpty: false }
  },
  last_name: {
    presence: { allowEmpty: false }
  }
}

export default class AddUserToActiveCampaignService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
    // 1. Add contact, retrieve result
      const clientInfo = this.filteredArgs
      let leadData = await ActiveCampaign.addContact({
        email: clientInfo.email,
        phone: clientInfo.phone_number,
        firstName: clientInfo.first_name,
        lastName: clientInfo.last_name
      })
      if (leadData !== null) {
        leadData = leadData.body.contact
        logger.info('Lead data is added successfully')
      }
      let accountId = leadData.orgid
      const contactId = leadData.id
      if (accountId == null || accountId === '0' || accountId === '') {
      // Add account, associate with contact
        let accData = await ActiveCampaign.addAccount({ name: clientInfo.name })
        if (accData !== null) {
          accData = accData.body.organization
          logger.info('Account data is added successfully')
        }
        accountId = accData.id
      }
      // 2. Update lead Account
      await ActiveCampaign.updateLead({ email: clientInfo.email, orgid: accountId })

      // 3. Update list for lead
      if (contactId !== null) {
        await ActiveCampaign.updateList({ list: clientInfo.list_id, contact: contactId, status: 1 })
      }
      return `User with id ${this.user_id} added to active campaign Successfully`
    } catch (err) {
      logger.error(getErrorMessageForService('AddUserToActiveCampaignService'), err)
    }
  }
}
