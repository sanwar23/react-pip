import ServiceBase from '../../../common/serviceBase'
import { ERRORS } from '../../../utils/errors'
import logger from '../../../common/logger'
import _ from 'lodash'
import { getErrorMessageForService } from '../../helper'
import { addTestEntries, updateCourseStatus } from '../../helper/people'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  course_id: {
    presence: { allowEmpty: false }
  },
  section_id: {
    presence: { allowEmpty: false }
  },
  questions: {
    presence: { allowEmpty: false }
  },
  course_status: {
    presence: { allowEmpty: false }
  }
}

export class PeopleAddTestEntriesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_id, course_id, section_id, questions, course_status } = this.filteredArgs

      await addTestEntries({ user_id, course_id, sectionIds: [section_id], questions, testType: 'section_wise' })

      if (_.isEqual(course_status, 'completed')) {
        await updateCourseStatus({ user_id, course_id })
      }
    } catch (e) {
      logger.error(getErrorMessageForService('PeopleAddTestEntriesService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
