import ServiceBase from '../../../common/serviceBase'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService } from '../../helper'
import { fetchAllTestEntries, formatTestEntriesData } from '../../helper/people'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  course_id: {
    presence: { allowEmpty: false }
  }
}

export class PeopleGetAllTestEntriesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { course_id, user_id } = this.filteredArgs

      const testEntriesData = await fetchAllTestEntries({ course_id, user_id })

      if (testEntriesData) {
        const formatedData = formatTestEntriesData({ course_id, testEntriesData })
        return formatedData
      } else {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.DATA_NOT_FOUND)
      }
    } catch (e) {
      logger.error(getErrorMessageForService('PeopleGetAllTestEntriesService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
