import Request from '../../../lib/request'
import config from '../../../config/app'

class ActiveCampaign {
  constructor () {
    const url = config.get('activeCampaign.baseUrl')
    const headers = { 'Api-Token': config.get('activeCampaign.apiToken') }
    this.client = new Request(url, headers)
  }

  async addContact ({ email, phone, firstName, lastName }) {
    const body = {
      contact: {
        email,
        phone,
        firstName,
        lastName
      }
    }
    const result = await this.client.post('/contact/sync', body)
    return result
  }

  async addAccount ({ name }) {
    const body = {
      organization: {
        name
      }
    }
    const result = await this.client.post('/organizations', body)
    return result
  }

  async updateList ({ list, contact, status }) {
    const body = {
      contactList: {
        list,
        contact,
        status
      }
    }
    const result = await this.client.post('/contactLists', body)
    return result
  }

  async updateLead ({ email, orgid }) {
    const body = {
      contact: {
        email,
        orgid
      }
    }
    const result = await this.client.post('/contact/sync', body)
    return result
  }
}

module.exports = new ActiveCampaign()
