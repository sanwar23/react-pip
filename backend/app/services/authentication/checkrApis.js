import Request from '../../../lib/request'
import config from '../../../config/app'
import logger from '../../common/logger'

class Checkr {
  constructor () {
    const url = config.get('checkr.baseUrl')
    const apiKey = Buffer.from(config.get('checkr.secretKey')).toString('base64')
    const headers = { authorization: `Basic ${apiKey}` }
    this.client = new Request(url, headers)
  }

  // CRUD Candidates
  async createCandidate ({ first_name, last_name, email, dob, zipcode, ssn }) {
    const body = {
      first_name,
      no_middle_name: 'true',
      last_name,
      email,
      dob,
      zipcode,
      ssn
    }

    const result = await this.client.post('/candidates', body)
    if (result.statusCode === 201 || result.statusCode === 200) {
      return result.body
    } else {
      logger.error(`Checkr Candidate Creation Failed === ${email}`)
    }
  }

  async updateCandidate ({ first_name, last_name, email, dob, ssn, candidate_id, zipcode }) {
    const body = {
      first_name,
      no_middle_name: 'true',
      last_name,
      email,
      dob,
      ssn,
      zipcode
    }

    const result = await this.client.post(`/candidates/${candidate_id}`, body)
    return result
  }

  async getExistingCandidate ({ candidate_id }) {
    const result = await this.client.get(`/candidates/${candidate_id}`)
    return result
  }

  async getAllCandidates () {
    const result = await this.client.get('/candidates')
    return result
  }

  // CRUD Report
  async createReport ({ candidate_id, scr_pkg = 'tasker_pro' }) {
    const body = {
      candidate_id,
      package: scr_pkg
    }
    const result = await this.client.post('/reports', body)
    return result
  }

  async getReport ({ report_id }) {
    const result = await this.client.get(`/reports/${report_id}`)
    return result
  }

  // CRUD Invitations
  async createInvitation ({ candidate_id, scr_pkg = 'tasker_pro' }) {
    const body = {
      package: scr_pkg,
      candidate_id
    }
    const result = await this.client.post('/invitations', body)
    if (result.statusCode === 201 || result.statusCode === 200) {
      return result.body
    } else {
      logger.error(`Checkr Invitation Creation Failed === ${candidate_id}`)
    }
    return result
  }

  async getAllInvitations () {
    const result = await this.client.get('/invitations')
    return result
  }

  async getExistingInvitation ({ invitation_id }) {
    const result = await this.client.get(`/invitations/${invitation_id}`)
    return result
  }

  async cancelInvitation ({ invitation_id }) {
    const result = await this.client.delete(`/invitations/${invitation_id}`)
    return result
  }

  // Screening services
  async getSsnTrace ({ ssn_trace_id }) {
    const result = await this.client.get(`/ssn_traces/${ssn_trace_id}`)
    if (result.statusCode === 200) {
      logger.info(`Checkr ssn_trace Successful === status: ${result.body.status}`)
      return result.body
    } else {
      logger.error(`Checkr ssn_trace Failed === id: ${ssn_trace_id}`)
    }
    return result
  }

  async getNationalCriminalSearch ({ national_criminal_search_id }) {
    const result = await this.client.get(`/national_criminal_searches/${national_criminal_search_id}`)
    if (result.statusCode === 200) {
      logger.info(`Checkr national_criminal_search Successful === status: ${result.body.status}`)
      return result.body
    } else {
      logger.error(`Checkr national_criminal_search Failed === id: ${national_criminal_search_id}`)
    }
    return result
  }

  async getSexOffenderSearch ({ sex_offender_search_id }) {
    const result = await this.client.get(`/sex_offender_searches/${sex_offender_search_id}`)
    if (result.statusCode === 200) {
      logger.info(`Checkr sex_offender_search Successful === status: ${result.body.status}`)
      return result.body
    } else {
      logger.error(`Checkr sex_offender_search Failed === id: ${sex_offender_search_id}`)
    }
    return result
  }

  async getGlobalWatchlistSearch ({ global_watchlist_search_id }) {
    const result = await this.client.get(`/global_watchlist_searches/${global_watchlist_search_id}`)
    if (result.statusCode === 200) {
      logger.info(`Checkr global_watchlist_search Successful === status: ${result.body.status}`)
      return result.body
    } else {
      logger.error(`Checkr global_watchlist_search Failed === id: ${global_watchlist_search_id}`)
    }
    return result
  }
}

module.exports = new Checkr()
