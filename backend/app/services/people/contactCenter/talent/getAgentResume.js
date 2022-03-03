import ServiceBase from '../../../../common/serviceBase'
import { getConnectionType, getErrorMessageForService, getNoOfFollowersAndFollowings } from '../../../helper'
import { getAgentResume } from '../../../helper/people'
import logger from '../../../../common/logger'
import { ERRORS, MESSAGES } from '../../../../utils/errors'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  candidate_id: {
    presence: { allowEmpty: false }
  }
}

export class PeopleGetAgentResumeService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { candidate_id, user_id } = this.filteredArgs
    try {
      const connectionType = await getConnectionType({ follower_id: user_id, user_to_follow_id: candidate_id })

      if (connectionType === 'blocked') {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.USER_NOT_FOUND)
      }

      const promises = [
        () => getAgentResume({ candidateId: candidate_id }),
        () => getConnectionType({ user_to_follow_id: user_id, follower_id: candidate_id }),
        () => getNoOfFollowersAndFollowings({ user_id: candidate_id })
      ]
      const [
        profile,
        reverseConnectionType,
        { noOfFollowers, noOfFollowings }
      ] = await Promise.all(promises.map(promise => promise()))

      if (profile) {
        const { UserDetail: userDetails } = profile
        const primaryLanguage = [userDetails.primary_language]
        const secondaryLanguages = userDetails.other_languages ? userDetails.other_languages.split(',') : []
        const languages = userDetails.primary_language ? primaryLanguage.concat(secondaryLanguages) : secondaryLanguages

        let location = userDetails.city ? userDetails.city : ''
        location = location.concat(location && userDetails.state ? ', ' : '')
        location = location.concat(userDetails.state ? userDetails.state : '')

        const agentResume = {
          candidateId: userDetails.user_id,
          candidateName: userDetails.first_name + ' ' + userDetails.last_name,
          location,
          languages,
          highestEducation: userDetails.highest_education,
          yearsOfExperience: userDetails.years_of_experience,
          profileName: userDetails.work_title,
          profileImage: userDetails.profile_image,
          profileDescription: userDetails.work_overview,
          agentResourceId: profile.resource_def_id,
          ratePerHourDollar: profile.desired_min_pay,
          availability: profile.status,
          candidateRating: userDetails.rating,
          skills: userDetails.userSkills.map(userSkill => ({
            skillId: userSkill.skill_id,
            skillName: userSkill.skill.skill_name,
            endorsedCount: userSkill.endorsed
          })),
          followers: noOfFollowers,
          following: noOfFollowings,
          isFollowing: ['following', 'connected'].includes(connectionType),
          hasBlockedUser: reverseConnectionType === 'blocked'
        }

        return agentResume
      }
    } catch (err) {
      logger.error(getErrorMessageForService('PeopleGetAgentResumeService'), err)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
