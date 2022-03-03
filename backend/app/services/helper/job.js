import {
  XQodJob,
  XQodApplication,
  XQodCategory,
  XQodJobTitle,
  XQodSkill,
  XQodJobSkill,
  XQodJobCourse,
  XClient,
  UserDetail,
  User
} from '../../db/models'
import Sequelize, { Op } from 'sequelize'
import { createNewEntity, aggregate, updateEntity } from '../helper'
import _ from 'lodash'
import { getUserDetailsByClientId } from './user'
import { countJobApplicationsByJobId } from './jobApplication'
import { getAll } from './crud'
import { formatDate } from './common'

export async function getRecentJobsByClient ({ client_id, limit = 5 }) {
  const jobDetails = []
  const jobs = await XQodJob.findAll({
    where: {
      is_active: true,
      client_id,
      [Op.not]: [{ is_deleted: true }]
    },
    raw: true,
    attributes: ['job_id', 'title'],
    order: [['created_on', 'DESC']],
    limit
  })
  for (const job of jobs) {
    // Get count of applicants
    const totalApplicants = await XQodApplication.count('application_id', {
      where: {
        job_id: job.job_id,
        status: 'recruiting',
        is_active: true
      }
    })
    jobDetails.push({
      job_id: job.job_id,
      title: job.title,
      totalApplicants
    })
  }
  return jobDetails
}

export async function addJob (data) {
  const newJob = await createNewEntity({
    model: XQodJob,
    data
  })

  let coursesDataToBeAdded = []
  let skillsDataToBeAdded = []

  // Adding courses data for newly added job.
  if (data && data.required_courses && data.required_courses.length) {
    coursesDataToBeAdded = [
      ...coursesDataToBeAdded,
      ...data.required_courses.map(course => {
        return ({
          job_id: newJob.job_id,
          course_id: course.courseId,
          course_preference: 'required'
        })
      })]
  }

  if (data && data.bonus_courses && data.bonus_courses.length) {
    coursesDataToBeAdded = [
      ...coursesDataToBeAdded,
      ...data.bonus_courses.map(course => {
        return ({
          job_id: newJob.job_id,
          course_id: course.courseId,
          course_preference: 'plus'
        })
      })]
  }

  if (coursesDataToBeAdded.length) {
    await XQodJobCourse.bulkCreate(coursesDataToBeAdded)
  }

  // Adding skills data for newly added job.
  if (data && data.required_skills && data.required_skills.length) {
    skillsDataToBeAdded = [
      ...skillsDataToBeAdded,
      ...data.required_skills.map(skill => {
        return ({
          job_id: newJob.job_id,
          skill_id: skill.skillId,
          skill_preference: 'required'
        })
      })]
  }

  if (data && data.bonus_skills && data.bonus_skills.length) {
    skillsDataToBeAdded = [
      ...skillsDataToBeAdded,
      ...data.bonus_skills.map(skill => {
        return ({
          job_id: newJob.job_id,
          skill_id: skill.skillId,
          skill_preference: 'plus'
        })
      })]
  }

  if (skillsDataToBeAdded.length) {
    await XQodJobSkill.bulkCreate(skillsDataToBeAdded)
  }

  return newJob
}

export async function updateJob (data) {
  const updatedJob = await updateEntity({
    model: XQodJob,
    data
  })

  // Destroying previous records of requiredSkills and bonusSkills
  await XQodJobSkill.destroy({
    where: {
      job_id: data.job_id
    }
  })

  let skillsDataToBeAdded = []
  let coursesDataToBeAdded = []

  // Updating new required skills data
  if (data && data.required_skills && data.required_skills.length) {
    skillsDataToBeAdded = [
      ...skillsDataToBeAdded,
      ...data.required_skills.map(skill => {
        return ({
          job_id: data.job_id,
          skill_id: skill.skillId,
          skill_preference: 'required'
        })
      })]
  }

  if (data && data.bonus_skills && data.bonus_skills.length) {
    skillsDataToBeAdded = [
      ...skillsDataToBeAdded,
      ...data.bonus_skills.map(skill => {
        return ({
          job_id: data.job_id,
          skill_id: skill.skillId,
          skill_preference: 'plus'
        })
      })]
  }

  if (skillsDataToBeAdded.length) {
    await XQodJobSkill.bulkCreate(skillsDataToBeAdded)
  }

  // Destroying previous records of required courses and bonus courses
  await XQodJobCourse.destroy({
    where: {
      job_id: data.job_id
    }
  })

  // Updating new required and bonus courses data
  if (data && data.required_courses && data.required_courses.length) {
    coursesDataToBeAdded = [
      ...coursesDataToBeAdded,
      ...data.required_courses.map(course => {
        return ({
          job_id: data.job_id,
          course_id: course.courseId,
          course_preference: 'required'
        })
      })]
  }

  if (data && data.bonus_courses && data.bonus_courses.length) {
    coursesDataToBeAdded = [
      ...coursesDataToBeAdded,
      ...data.bonus_courses.map(course => {
        return ({
          job_id: data.job_id,
          course_id: course.courseId,
          course_preference: 'plus'
        })
      })]
  }

  if (coursesDataToBeAdded.length) {
    await XQodJobCourse.bulkCreate(coursesDataToBeAdded)
  }

  return updatedJob
}

export async function getAllJobsSubDetails ({ search_keyword, category_id }) {
  let query = { [Op.not]: [{ is_deleted: true }] }
  if (!_.isEmpty(search_keyword)) {
    query = { ...query, title: { [Op.startsWith]: search_keyword } }
  }

  if (!_.isEmpty(category_id)) {
    query = { ...query, category_id }
  }

  const allJobsSubDetails = await XQodJob.findAll({
    where: query,
    raw: true
  })
  return allJobsSubDetails
}

export async function getOpenJobPostings () {
  const openJobPostings = await XQodJob.findAll({
    where: {
      is_active: true,
      is_public: true,
      [Op.not]: [{ is_deleted: true }]
    },
    raw: true
  })
  return openJobPostings
}

export async function applyToJobPostingByUser ({
  user_id,
  job_id,
  cover_letter,
  video_pitch_url
}) {
  const newApplication = await createNewEntity({
    model: XQodApplication,
    data: {
      user_id,
      job_id,
      cover_letter,
      video_pitch_url,
      status: 'applied'
    }
  })
  return newApplication
}

export async function getApplicationsByJobId ({ job_id }) {
  const applicants = await XQodApplication.findAll({
    where: { job_id },
    raw: true
  })
  return applicants
}

export async function getApplicationsByUserId ({ user_id }) {
  const applications = await XQodApplication.findAll({
    where: { user_id },
    raw: true
  })
  return applications
}

export async function inviteUserForJob ({ job_id, user_id }) {
  const newApplication = await createNewEntity({
    model: XQodApplication,
    data: {
      user_id,
      job_id,
      status: 'invited'
    }
  })
  // TODO: Sending job invite email to user
  return newApplication
}

export async function handleApplicantResponse ({ application_id, status }) {
  await XQodApplication.update({
    status,
    where: { application_id }
  })
  switch (status) {
    case 'hired':
      // TODO: Send offer acceptance mail to employer
      break
    case 'rejected':
      // TODO: To be decided
      break
  }
}

export async function getJobById ({ job_id }) {
  const jobDetails = await XQodJob.findOne({
    include: [{
      model: XQodCategory,
      attributes: ['category_name']
    }, {
      model: XClient,
      attributes: [
        'client_id',
        'client_name',
        'city',
        'state',
        'registration_date',
        'title',
        'summary',
        'rating'
      ]
    }],
    where:
    {
      job_id,
      [Op.not]: [{ is_deleted: true }]
    },
    raw: true,
    nest: true
  })
  const jobApplicationStats = await countJobApplicationsByJobId({ job_id })
  const userDetails = await getUserDetailsByClientId({ client_id: jobDetails.XClient.client_id })
  const jobData = await getJobsAndHiredCount({ client_id: jobDetails.XClient.client_id })

  return {
    ...jobDetails,
    XClient: {
      ...jobDetails.XClient,
      profile_image: userDetails.profile_image,
      jobsPosted: jobData.noOfJobsPosted,
      hires: jobData.noOfHires
    },
    jobApplicationStats
  }
}

export async function getSkillsByJobId ({ job_id }) {
  const jobSKillsData = await XQodJobSkill.findAll({
    include: [{
      model: XQodSkill,
      attributes: ['skill_name']
    }],
    where: {
      job_id
    },
    raw: true
  })
  return jobSKillsData
}

export async function getCoursesByJobId ({ job_id }) {
  const jobCourses = await XQodJobCourse.findAll({ where: { job_id }, raw: true })
  return jobCourses
}

export async function getJobApplicationById ({ application_id }) {
  const jobApplicationDetails = await XQodApplication.findOne({ where: { application_id } })
  return jobApplicationDetails
}

export function formatJobCourseData ({ jobCoursesData, courses }) {
  return jobCoursesData.map((course) => {
    const currCourse = courses.find((item) => item.course_id === course.course_id)

    return {
      jobCourseId: course.job_course_id,
      courseId: course.course_id,
      coursePreference: course.course_preference,
      courseTitle: !_.isUndefined(currCourse) && currCourse.title,
      createdAt: !_.isUndefined(currCourse) && currCourse.createdAt && formatDate(currCourse.createdAt),
      creatorName: !_.isUndefined(currCourse) && currCourse.creatorDetails &&
        currCourse.creatorDetails.firstName + ' ' + currCourse.creatorDetails.lastName,
      courseImage: !_.isUndefined(currCourse) && currCourse.image_url
    }
  })
}

export async function flagApplicationsById ({ application_id, status }) {
  await XQodApplication.update({
    status,
    where: { application_id }
  })
  switch (status) {
    case 'offered':
      // Send Email offer to applicant
      break
    case 'declined':
      break
    case 'evaluating':
      break
  }
}

export async function getAllJobCategories ({ search_keyword }) {
  let query = {}
  if (!_.isEmpty(search_keyword)) {
    query = { ...query, category_name: { [Op.startsWith]: search_keyword } }
  }
  return XQodCategory.findAll({
    where: query,
    attributes: [['category_id', 'categoryId'], ['category_name', 'categoryTitle']],
    raw: true
  })
}

export async function getJobApplicationCount (data) {
  const res = await aggregate({ model: XQodApplication, data, aggFunction: 'count' })
  return res
}

export async function getJobTitles () {
  const jobTitles = await XQodJobTitle.findAll({ raw: true })
  return jobTitles
}

export async function getSkills () {
  const skills = await XQodSkill.findAll({ raw: true })
  return skills
}

export async function getSkillBySkillId ({ skill_id }) {
  const skill = await XQodSkill.findOne({ where: { skill_id }, raw: true })
  return skill
}

export async function getXQodApplications (queryObj) {
  let query = { raw: true }
  if (queryObj) {
    query = { ...query, ...queryObj }
  }
  return XQodApplication.findAll(query)
}

export async function getJobsDetailsByCategoryForClient ({ category_id }) {
  const jobs = await getAllJobsSubDetails({ category_id })
  return jobs
}

export async function getJobsDetailsForClient ({ user_id, client_id, category_id, search_keyword }) {
  const promises = [
    () => getAllJobsSubDetails({ search_keyword, category_id }),
    () => getAllJobCategories({ category_id })
  ]

  const [allJobs, jobCategories] = await Promise.all(promises.map(promise => promise()))
  const jobDetails = []

  for (const jobCategory of jobCategories) {
    const jobsByCategory = allJobs.filter(job => job.category_id === jobCategory.category_id)
    const jobs = await getFilteredJobs({ jobsByCategory })
    jobDetails.push({
      categoryId: jobCategory.category_id,
      categoryTitle: jobCategory.category_name,
      jobs
    })
  }
  return jobDetails
}

export async function getFilteredJobs ({ jobsByCategory }) {
  const filteredJobs = []
  for (const job of jobsByCategory) {
    const noOfApplications = await getJobApplicationCount({ job_id: job.job_id })
    filteredJobs.push({
      jobId: job.job_id,
      ownerId: job.user_id,
      categoryId: job.category_id,
      needed: job.needed,
      fulfilled: job.fulfilled,
      title: job.title,
      description: job.description,
      evaluating: 4,
      noOfApplications
    })
  }
  return filteredJobs
}

export function getJobsDetailsForUser ({ user_id, client_id }) {

}

export async function deleteJob ({ job_id }) {
  const jobs = await XQodJob.update({ is_deleted: true },
    { where: { job_id } })
  return jobs
}

export async function getAllJobs ({ client_id, category_id, search_keyword, status, limit, offset }) {
  let query = {
    client_id,
    [Op.not]: [{ is_deleted: true }]
  }
  let additionalParams = {}

  if (!_.isEmpty(search_keyword)) {
    query = { ...query, title: { [Op.substring]: search_keyword } }
  }

  if (!_.isEmpty(category_id)) {
    query = { ...query, category_id }
  }

  if (!_.isEmpty(status)) {
    query = { ...query, status }
  }

  if (!_.isUndefined(limit)) {
    additionalParams = { limit: parseInt(limit) }
  }

  if (!_.isUndefined(offset)) {
    additionalParams = { ...additionalParams, offset: parseInt(offset) }
  }

  const allJobsSubDetails = await XQodCategory.findAndCountAll({
    attributes: [['category_id', 'categoryId'], ['category_name', 'categoryTitle']],
    include: [{
      model: XQodJob,
      as: 'jobs',
      where: query
    }],
    ...additionalParams
  })

  return allJobsSubDetails.rows.map((job) => (job.get({ plain: true })))
}

export async function getAgentJobs ({
  searchKeyword,
  requiredEmploymentType,
  requiredHourlyRate,
  requiredRating
  // WIP - requiredLocation
}) {
  let xQodJobQuery = {
    is_deleted: false,
    [Op.not]: [{ status: 'draft' }]
  }
  let xClientQuery = {}

  // Search Jobs
  if (!_.isEmpty(searchKeyword)) {
    xQodJobQuery = {
      ...xQodJobQuery,
      title: {
        [Op.substring]: searchKeyword
      }
    }
  }

  // Employment type filter
  if (requiredEmploymentType && requiredEmploymentType.employmentType) {
    xQodJobQuery = {
      ...xQodJobQuery,
      employment_type: requiredEmploymentType.employmentType
    }
  }

  // Hourly rate filter
  if (requiredHourlyRate) {
    const { lessThanEq, greaterThanEq } = requiredHourlyRate
    if (lessThanEq && !greaterThanEq) {
      xQodJobQuery = {
        ...xQodJobQuery,
        pay_amount: {
          [Op.lte]: lessThanEq
        }
      }
    } else if (greaterThanEq && !lessThanEq) {
      xQodJobQuery = {
        ...xQodJobQuery,
        pay_amount: {
          [Op.gte]: greaterThanEq
        }
      }
    } else if (greaterThanEq && lessThanEq) {
      xQodJobQuery = {
        ...xQodJobQuery,
        pay_amount: {
          [Op.and]: [
            { [Op.lte]: lessThanEq },
            { [Op.gte]: greaterThanEq }
          ]
        }
      }
    }
  }

  // Employers rating filter
  if (requiredRating && requiredRating.greaterThanEq) {
    xClientQuery = {
      ...xClientQuery,
      rating: {
        [Op.gte]: requiredRating.greaterThanEq
      }
    }
  }

  const agentJobs = await XQodJob.findAll({
    include: [
      {
        model: XClient,
        attributes: [
          'client_id',
          'client_name',
          'city',
          'state',
          'rating'
        ],
        where: xClientQuery
      },
      {
        model: XQodJobSkill,
        attributes: ['skill_id', 'skill_preference'],
        as: 'requiredJobSkills',
        where: { skill_preference: 'required' }
      },
      {
        model: UserDetail,
        attributes: ['profile_image']
      }
    ],
    where: xQodJobQuery
  })

  return agentJobs.map(jobs => jobs.get({ plain: true }))
}

export async function getTopCompanies () {
  const xQodJobQuery = {
    [Op.not]: [{ is_deleted: true }],
    status: 'recruiting'
  }
  const topCompanies = await XQodJob.findAll({
    group: ['client_id'],
    attributes: ['client_id', [Sequelize.fn('count', Sequelize.col('status')), 'openPositionCount']],
    include: [{
      model: XClient,
      attributes: [
        'client_name',
        'rating'
      ]
    }, {
      model: UserDetail,
      attributes: ['profile_image']
    }],
    where: xQodJobQuery
  })
  return topCompanies.map(jobs => jobs.get({ plain: true }))
}

export const getPeoplpeYouMayKnow = async ({ user_id }) => {
  const userApplications = await getAll({
    model: XQodApplication,
    data: {
      user_id,
      status: 'hired'
    },
    attributes: ['client_id']
  })
  const userCompanies = new Set(userApplications.map(application => application.client_id))
  const knownPeople = await UserDetail.findAll({
    attributes: [
      'user_id', 'work_title', 'rating', 'profile_image'
    ],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['full_name'],
        where: { user_code: 'agent' }
      },
      {
        model: XQodApplication,
        where: {
          client_id: Array.from(userCompanies),
          status: 'hired',
          [Op.not]: [{ user_id }]
        }
      }
    ],
    limit: 10
  })
  return knownPeople.map(people => people.get({ plain: true }))
}

export const getJobsAndHiredCount = async ({ client_id }) => {
  const jobData = await XQodJob.findOne({
    attributes: [
      [Sequelize.fn('COUNT', Sequelize.col('job_id')), 'noOfJobsPosted'],
      [Sequelize.fn('SUM', Sequelize.col('fulfilled')), 'noOfHires']
    ],
    where: {
      client_id,
      status: 'recruiting'
    },
    raw: true
  })

  return {
    noOfJobsPosted: jobData.noOfJobsPosted,
    noOfHires: jobData.noOfHires
  }
}
