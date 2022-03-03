import { XQodApplication, UserDetail, XClient, XQodJob, XClientUser } from '../../db/models'
import { createNewEntity } from './common'
import { getOne } from './crud'
import _ from 'lodash'

export const createJobApplication = async ({
  agentUserId,
  clientId,
  jobId,
  coverLetter,
  videoPitchUrl,
  status
}) => {
  const application = await createNewEntity({
    model: XQodApplication,
    data: {
      user_id: agentUserId,
      client_id: clientId,
      job_id: jobId,
      cover_letter: coverLetter,
      video_pitch_url: videoPitchUrl,
      status
    }
  })
  const jobApplicationStats = await countJobApplicationsByJobId({ job_id: jobId })
  await XQodJob.update({
    fulfilled: jobApplicationStats.fulfilled,
    evaluating: jobApplicationStats.evaluating,
    pending: jobApplicationStats.pending
  },
  { where: { job_id: jobId } }
  )
  return application
}

export const fetchJobApplicationById = async ({ application_id }) => {
  const application = await getOne({
    model: XQodApplication,
    data: { application_id }
  })
  return application
}

export const getUserIdByJobId = async ({ job_id }) => {
  const jobDetails = await XQodJob.findOne({
    raw: true,
    attributes: ['user_id'],
    where: {
      job_id
    }
  })

  return jobDetails && jobDetails.user_id
}

export const updateJobApplicationById = async ({ application_id, jobId, status, statusReason = '' }) => {
  let updatedFields = { status, status_reason: statusReason }
  if (status === 'hired') {
    updatedFields = {
      ...updatedFields,
      start_date: Date.now()
    }
  }

  const updatedApplication = await XQodApplication.update(
    updatedFields,
    { where: { application_id } }
  )

  const jobApplicationStats = await countJobApplicationsByJobId({ job_id: jobId })
  await XQodJob.update({
    fulfilled: jobApplicationStats.fulfilled,
    evaluating: jobApplicationStats.evaluating,
    pending: jobApplicationStats.pending
  },
  { where: { job_id: jobId } }
  )

  return updatedApplication
}

export const fetchJobApplicationByQuery = async ({ applicationId, clientId, agentUserId, jobId }) => {
  let query = {}
  if (applicationId) {
    query = {
      ...query,
      application_id: applicationId
    }
  }
  if (clientId) {
    query = {
      ...query,
      client_id: clientId
    }
  }
  if (agentUserId) {
    query = {
      ...query,
      user_id: agentUserId
    }
  }
  if (jobId) {
    query = {
      ...query,
      job_id: jobId
    }
  }

  let application

  if (applicationId) {
    application = await XQodApplication.findOne({
      where: query,
      raw: true,
      include: {
        model: XQodJob,
        attributes: ['title']
      }
    })

    application.job_title = application['XQodJob.title']
    delete application['XQodJob.title']
  } else {
    application = await getOne({
      model: XQodApplication,
      data: query
    })
  }

  return application
}

export const fetchAllJobApplications = async ({ applicationId, clientId, agentUserId, jobId }) => {
  let query = {}
  if (applicationId) {
    query = {
      ...query,
      application_id: applicationId
    }
  }
  if (clientId) {
    query = {
      ...query,
      client_id: clientId
    }
  }
  if (agentUserId) {
    query = {
      ...query,
      user_id: agentUserId
    }
  }
  if (jobId) {
    query = {
      ...query,
      job_id: jobId
    }
  }

  const applications = await XQodApplication.findAll({
    where: query,
    include: [{
      model: UserDetail,
      attributes: ['profile_image', 'first_name', 'last_name', 'work_title', 'work_overview', 'city', 'state', 'rating']
    }]
  })
  return applications.map(application => application.get({ plain: true }))
}

export const fetchAgentJobApplicationList = async ({ agentUserId, limit, offset, statusTypes }) => {
  let applicationQuery = {
    user_id: agentUserId
  }

  if (!_.isEmpty(statusTypes)) {
    applicationQuery = {
      ...applicationQuery,
      status: statusTypes
    }
  }

  const { rows, count } = await XQodApplication.findAndCountAll({
    where: applicationQuery,
    limit,
    offset,
    include: [
      {
        model: XClient,
        attributes: ['client_id', 'client_name', 'rating', 'title']
      },
      {
        model: XQodJob,
        attributes: [
          'job_id', 'title', 'description',
          'job_type', 'duration_type', 'duration_months',
          'city', 'state', 'pay_amount', 'needed', 'fulfilled'
        ],
        where: {
          is_deleted: false
        }
      }
    ]
  })

  let more = false
  if ((limit + offset) < count) {
    more = true
  }

  return {
    applications: rows && rows.map(application => application.get({ plain: true })),
    more
  }
}

export const getUserIdByClientIds = async ({ clientIds }) => {
  const userIds = await XClientUser.findAll({
    raw: true,
    where: {
      client_id: clientIds
    }
  })

  return userIds
}

export const getClientProfilePictures = async ({ userIds }) => {
  const clientProfilePictures = await UserDetail.findAll({
    raw: true,
    attributes: ['user_id', 'profile_image'],
    where: {
      user_id: userIds
    }
  })

  return clientProfilePictures
}

export const countJobApplicationsByJobId = async ({ job_id }) => {
  const jobApplicationStats = {
    fulfilled: 0,
    pending: 0,
    evaluating: 0,
    totalApplications: 0
  }
  const jobApplicationsData = await XQodApplication.findAll({
    where: {
      job_id
    },
    attributes: ['application_id', 'status'],
    raw: true
  })
  jobApplicationsData.map((application) => {
    if (['hired'].includes(application.status)) {
      jobApplicationStats.fulfilled += 1
    }
    if (['invited', 'applied', 'offered'].includes(application.status)) {
      jobApplicationStats.pending += 1
    }
    if (['screening', 'training'].includes(application.status)) {
      jobApplicationStats.evaluating += 1
    }
    if (['screening', 'training', 'hired', 'offered', 'resigned', 'terminated'].includes(application.status)) {
      jobApplicationStats.totalApplications += 1
    }
  })
  return jobApplicationStats
}
