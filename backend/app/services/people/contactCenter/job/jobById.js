import ServiceBase from '../../../../common/serviceBase'
import {
  getJobById, getErrorMessageForService, getSkillsByJobId, getCoursesByJobId, getCourseDetails, formatJobCourseData
} from '../../../helper'
import { ERRORS } from '../../../../utils/errors'
import logger from '../../../../common/logger'
const constraints = {
  job_id: {
    presence: { allowEmpty: false }
  }
}

export class GetJobByIdService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { job_id } = this.filteredArgs

      const promises = [
        () => getJobById({ job_id }),
        () => getSkillsByJobId({ job_id }),
        () => getCoursesByJobId({ job_id })
      ]

      const [jobDetails, jobSkillsData, jobCoursesData] = await Promise.all(promises.map(promise => promise()))
      let formattedCourseData = []

      if (jobCoursesData && jobCoursesData.length) {
        const courseData = await getCourseDetails({ courseIds: jobCoursesData.map((course) => course.course_id) })
        formattedCourseData = formatJobCourseData({ jobCoursesData, courses: courseData })
      }

      return { jobDetails, jobSkillsData, jobCoursesData: formattedCourseData }
    } catch (err) {
      logger.error(getErrorMessageForService('GetJobByIdService'), err)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
