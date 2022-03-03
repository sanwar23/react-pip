import ServiceBase from '../../../../common/serviceBase'
import { getErrorMessageForService } from '../../../helper'
import { getAgentJobProfiles } from '../../../helper/people'
import _ from 'lodash'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  searchKeyword: {},
  requiredSkills: {},
  requiredLanguages: {},
  requiredHourlyRate: {},
  requiredRating: {},
  requiredAvailability: {},
  requiredTalentType: {}
}

export class PeopleGetTalentCardsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let {
      requiredSkills,
      requiredLanguages,
      requiredHourlyRate,
      requiredRating,
      requiredAvailability,
      requiredTalentType,
      searchKeyword
    } = this.filteredArgs

    if (requiredSkills) {
      requiredSkills = JSON.parse(requiredSkills)
    }
    if (requiredHourlyRate) {
      requiredHourlyRate = JSON.parse(requiredHourlyRate)
    }
    if (requiredRating) {
      requiredRating = JSON.parse(requiredRating)
    }
    if (requiredAvailability) {
      requiredAvailability = JSON.parse(requiredAvailability)
    }
    if (requiredTalentType) {
      requiredTalentType = JSON.parse(requiredTalentType)
    }

    try {
      const agentJobProfiles = await getAgentJobProfiles({
        requiredLanguages,
        requiredHourlyRate,
        requiredRating,
        requiredAvailability,
        requiredTalentType,
        searchKeyword
      })
      let talentCards = agentJobProfiles.map(profile => {
        const { UserDetail: userDetails } = profile
        return (
          {
            candidateId: userDetails.user_id,
            candidateName: userDetails.first_name + ' ' + userDetails.last_name,
            candidatePic: userDetails.profile_image,
            location: userDetails.city + ', ' + userDetails.state,
            languages: profile.desired_languages,
            profileName: userDetails.work_title,
            profileDescription: userDetails.work_overview,
            agentResourceId: profile.resource_def_id,
            ratePerHourDollar: profile.desired_min_pay,
            availability: profile.status,
            candidateRating: userDetails.rating,
            skills: userDetails.userSkills.map(userSkill => ({
              skillId: userSkill.skill_id,
              skillName: userSkill.skill.skill_name,
              endorsedCount: userSkill.endorsed
            }))
          }
        )
      })
      if (requiredSkills && requiredSkills.length > 0) {
        talentCards = talentCards.filter(profile => {
          const userSkills = profile.skills.map(skill => skill.skillId)
          return (
            _.intersection(requiredSkills, userSkills).length > 0
          )
        })
      }
      return talentCards
    } catch (err) {
      getErrorMessageForService('PeopleGetTalentCardsService')
    }
    return 'okay'
  }
}
