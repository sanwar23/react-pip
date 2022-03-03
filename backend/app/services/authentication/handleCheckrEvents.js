import ServiceBase from '../../common/serviceBase'
import VerifyCheckrReportService from './verifyCheckrReport'
import logger from '../../common/logger'
import { updateUserScreeningDetail } from '../helper/checkr'

const constraints = {
  id: {
    presence: { allowEmpty: false }
  },
  object: {
    presence: { allowEmpty: false }
  },
  type: {
    presence: { allowEmpty: false }
  },
  data: {
    presence: { allowEmpty: false }
  }
}

export default class HandleCheckrEventService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { type, data } = this.filteredArgs
    switch (type) {
      // Candidate Events
      case ('candidate.created'): {
        return 'okay'
      }
      case ('candidate.updated'): {
        logger.info('Checkr Candidate Updated Successfully')
        return 'okay'
      }
      // Invitation Events
      case ('invitation.completed'): {
        const { candidate_id } = data.object
        await updateUserScreeningDetail({
          data: {
            status: 'invitation.completed'
          },
          candidate_id
        })
        logger.info('Checkr Invitation Completed Successful')
        return 'okay'
      }
      case ('invitation.expired'): {
        logger.info('Checkr Invitation Expired')
        return 'okay'
      }
      case ('invitation.deleted'): {
        return 'okay'
      }
      // Report Events
      case ('report.created'): {
        const { id, candidate_id } = data.object
        await updateUserScreeningDetail({
          data: {
            report_id: id,
            status: 'report.created'
          },
          candidate_id
        })

        logger.info('Checkr Report Created')
        return 'okay'
      }
      case ('report.completed'): {
        logger.info('Checkr Report Completed')
        // Verify Screening Report
        const {
          ssn_trace_id,
          national_criminal_search_id,
          sex_offender_search_id,
          global_watchlist_search_id,
          candidate_id
        } = data.object
        await VerifyCheckrReportService.execute({
          ssn_trace_id,
          national_criminal_search_id,
          sex_offender_search_id,
          global_watchlist_search_id
        })
        await updateUserScreeningDetail({
          data: {
            status: 'report.completed'
          },
          candidate_id
        })
        break
      }
      case ('report.pre_adverse_action'): {
        return 'okay'
      }
    }
  }
}
