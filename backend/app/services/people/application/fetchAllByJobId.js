import ServiceBase from '../../../common/serviceBase'
import { getErrorMessageForService, getJobById } from '../../helper'
import Logger from '../../../common/logger'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import { fetchAllJobApplications } from '../../helper/jobApplication'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  job_id: {
    presence: { allowEmpty: false }
  }
}

export class PeopleFetchJobApplicationsByJobIdService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { job_id } = this.filteredArgs
    try {
      const job = await getJobById({ job_id })
      if (!job) {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.JOB_NOT_EXIST)
        return
      }
      let jobApplications = await fetchAllJobApplications({ jobId: parseInt(job_id), clientId: job.client_id })
      jobApplications = jobApplications.map(application => ({
        application: {
          applicationId: application.application_id,
          agentUserId: application.user_id,
          clientId: application.client_id,
          jobId: application.job_id,
          coverLetter: application.cover_letter,
          status: application.status,
          createdOn: application.createdAt,
          updateOn: application.updatedAt
        },
        userDetails: {
          fullName: `${application.UserDetail.first_name} ${application.UserDetail.last_name}`,
          title: application.UserDetail.work_title,
          summary: application.UserDetail.work_overview,
          profileImage: application.UserDetail.profile_image,
          rating: application.UserDetail.rating,
          location: `${application.UserDetail.city || ''}${application.UserDetail.city && application.UserDetail.state
            ? ', ' : ''}${application.UserDetail.state || ''}`
        }
      }))
      return jobApplications
    } catch (err) {
      Logger.error(`${getErrorMessageForService('PeopleFetchJobApplicationsByJobIdService')} ${err}`)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
