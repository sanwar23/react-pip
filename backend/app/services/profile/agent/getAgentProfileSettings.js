import { ERRORS, MESSAGES } from '../../../utils/errors'
import ServiceBase from '../../../common/serviceBase'
import {
  getErrorMessageForService,
  getNoOfFollowersAndFollowings,
  getUserById,
  getUserDetails
} from '../../helper'
import { decryptData } from '../../../utils/encryption'
import logger from '../../../common/logger'
import { getUserTalentData } from '../../helper/agentProfile'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  }
}

export class GetAgentProfileSettingsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user_id } = this.filteredArgs

    try {
      const promises = [
        () => getUserById({ user_id }),
        () => getUserDetails({ user_id }),
        () => getUserTalentData({ user_id }),
        () => getNoOfFollowersAndFollowings({ user_id })
      ]
      const [
        user,
        userDetails,
        talentData,
        { noOfFollowers, noOfFollowings }
      ] = await Promise.all(promises.map(promise => promise()))

      if (!user) {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.USER_NOT_FOUND)
      }

      const dob = decryptData(userDetails.dob)
      const ssn = '***-**-' + decryptData(userDetails.ssn).substring(7)
      const userName = user.user.replace('.qbe', '')
      const primaryLanguage = [userDetails.primary_language]
      const secondaryLanguages = userDetails.other_languages ? userDetails.other_languages.split(',') : []
      const languages = primaryLanguage.concat(secondaryLanguages)
      const userTalentData = talentData && {
        onVacation: talentData.status === 'on vacation',
        hourlyRate: talentData.desired_min_pay,
        preferredJob: talentData.desired_employment_type,
        remoteJobs: talentData.desired_location_type === 'remote',
        profileVisible: talentData.is_visible
      }
      const agentAccountSettings = {
        userName,
        fullName: user.full_name,
        street: userDetails.street_address,
        city: userDetails.city,
        state: userDetails.state,
        zip: userDetails.zip,
        dob,
        ssn,
        gender: userDetails.gender,
        active: !!userDetails.is_online,
        email: user.email,
        homePhone: userDetails.home_phone,
        mobileNumber: userDetails.mobile_phone,
        smsNotification: !!userDetails.notify_sms,
        emailNotification: !!userDetails.notify_email,
        rating: userDetails.rating,
        title: userDetails.work_title,
        summary: userDetails.work_overview,
        highestEducation: userDetails.highest_education,
        yearsOfExperience: userDetails.years_of_experience,
        profilePic: userDetails.profile_image,
        languages,
        followers: noOfFollowers,
        following: noOfFollowings,
        ...userTalentData
      }

      return agentAccountSettings
    } catch (err) {
      logger.error(`${getErrorMessageForService('GetAgentProfileSettingsService')} ${err}`)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
