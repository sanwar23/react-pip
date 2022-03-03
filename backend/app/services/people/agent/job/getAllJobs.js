import ServiceBase from '../../../../common/serviceBase'
import {

  getErrorMessageForService, getAgentJobs
} from '../../../helper'
import { ERRORS } from '../../../../utils/errors'
import logger from '../../../../common/logger'
import _ from 'lodash'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  searchKeyword: {},
  requiredSkills: {},
  requiredLanguages: {},
  requiredEmploymentType: {},
  requiredHourlyRate: {},
  requiredRating: {},
  requiredLocation: {},
  requiredCategory: {}
}

export class AgentGetAllJobsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let {
      searchKeyword,
      requiredCategory,
      requiredSkills,
      requiredLanguages,
      requiredEmploymentType,
      requiredHourlyRate,
      requiredRating,
      requiredLocation
    } = this.filteredArgs

    if (requiredCategory) {
      requiredCategory = JSON.parse(requiredCategory)
    }
    if (requiredSkills) {
      requiredSkills = JSON.parse(requiredSkills)
    }
    if (requiredLanguages) {
      requiredLanguages = JSON.parse(requiredLanguages)
    }
    if (requiredEmploymentType) {
      requiredEmploymentType = JSON.parse(requiredEmploymentType)
    }
    if (requiredHourlyRate) {
      requiredHourlyRate = JSON.parse(requiredHourlyRate)
    }
    if (requiredRating) {
      requiredRating = JSON.parse(requiredRating)
    }
    if (requiredLocation) {
      requiredLocation = JSON.parse(requiredLocation)
    }
    try {
      const agentJobsData = await getAgentJobs({
        searchKeyword,
        requiredEmploymentType,
        requiredHourlyRate,
        requiredRating,
        requiredLocation
      })
      let agentJobCards = agentJobsData.map(job => {
        const { XClient: clientData } = job
        const { UserDetail: userDetailData } = job
        return {
          jobId: job.job_id,
          categoryId: job.category_id,
          clientId: job.client_id,
          clientName: clientData.client_name,
          clientRating: clientData.rating,
          clientPic: userDetailData.profile_image,
          title: job.title,
          description: job.description,
          jobType: job.job_type,
          employmentType: job.employment_type,
          durationType: job.duration_type,
          durationMonths: job.duration_months,
          experienceType: job.experience_type,
          clientLocation: clientData.city + ', ' + clientData.state,
          needed: job.needed,
          fulfilled: job.fulfilled,
          payAmount: job.pay_amount,
          languages: job.languages,
          requiredJobSkills: job.requiredJobSkills
        }
      })
      if (requiredSkills && requiredSkills.length > 0) {
        agentJobCards = agentJobCards.filter(job => {
          const skills = job.requiredJobSkills.map(skill => skill.skill_id)
          return (
            _.intersection(requiredSkills, skills).length > 0
          )
        })
      }
      if (requiredCategory && requiredCategory.length > 0) {
        agentJobCards = agentJobCards.filter(job => {
          return requiredCategory.includes(job.categoryId)
        })
      }
      if (requiredLanguages && requiredLanguages.length > 0) {
        agentJobCards = agentJobCards.filter(job => {
          const languages = job.languages.length > 1 ? job.languages.split(',') : job.languages
          const commonLanguages = _.intersection(requiredLanguages, languages)
          return commonLanguages.length > 0
        })
      }
      return agentJobCards
    } catch (e) {
      logger.error(getErrorMessageForService('AgentGetAllJobsService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
