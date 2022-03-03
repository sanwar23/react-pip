import ServiceBase from '../../common/serviceBase'
import Checkr from './checkrApis'
import logger from '../../common/logger'
import { getErrorMessageForService } from '../helper'
import { ERRORS } from '../../utils/errors'

const constraints = {
  ssn_trace_id: {
    presence: { allowEmpty: false }
  },
  national_criminal_search_id: {
    presence: { allowEmpty: false }
  },
  sex_offender_search_id: {
    presence: { allowEmpty: false }
  },
  global_watchlist_search_id: {
    presence: { allowEmpty: false }
  }
}

export default class VerifyCheckrReportService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      ssn_trace_id,
      national_criminal_search_id,
      sex_offender_search_id,
      global_watchlist_search_id
    } = this.filteredArgs
    try {
      const ssnTracerReport = await Checkr.getSsnTrace({ ssn_trace_id })
      if (ssnTracerReport && ssnTracerReport.status === 'clear') {
      // Assign Nifty Tokens to User
      // Add user notification for Nifty tokens and screening completion
      } else {
      // Add user notification about screening test results
      }

      const sexOffenderSearchReport = await Checkr.getSexOffenderSearch({ sex_offender_search_id })
      if (sexOffenderSearchReport && sexOffenderSearchReport.status === 'clear') {
      // Assign Nifty Tokens to User
      // Add user notification for Nifty tokens and screening completion
      } else {
      // Add user notification about screening test results
      }

      const nationalCriminalSearchReport = await Checkr.getNationalCriminalSearch({ national_criminal_search_id })
      if (nationalCriminalSearchReport && nationalCriminalSearchReport.status === 'clear') {
      // Assign Nifty Tokens to User
      // Add user notification for Nifty tokens and screening completion
      } else {
      // Add user notification about screening test results
      }

      const globalWatchlistSearchReport = await Checkr.getGlobalWatchlistSearch({ global_watchlist_search_id })
      if (globalWatchlistSearchReport && globalWatchlistSearchReport.status === 'clear') {
      // Assign Nifty Tokens to User
      // Add user notification for Nifty tokens and screening completion
      } else {
      // Add user notification about screening test results
      }
    } catch (error) {
      logger.error(getErrorMessageForService('VerifyCheckrReportService'), error)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
