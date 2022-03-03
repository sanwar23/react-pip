import { ERRORS, MESSAGES } from '../../../utils/errors'
import ServiceBase from '../../../common/serviceBase'
import {
  getErrorMessageForService,
  getClientIdByUserId, getUserById, getClientData, getUserDetails, getNoOfFollowersAndFollowings, getJobsAndHiredCount
} from '../../helper'
import logger from '../../../common/logger'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  }
}

export class GetCompanyProfileSettingsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user_id } = this.filteredArgs

    try {
      const promises = [
        () => getUserById({ user_id }),
        () => getClientIdByUserId({ user_id }),
        () => getUserDetails({ user_id }),
        () => getNoOfFollowersAndFollowings({ user_id })
      ]
      const [
        user,
        clientUser,
        userDetails,
        { noOfFollowers, noOfFollowings }
      ] = await Promise.all(promises.map(promise => promise()))

      if (!user) {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.USER_NOT_FOUND)
      }
      if (!(clientUser && clientUser.client_id)) {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.CLIENT_NOT_EXIST)
      }

      const clientPromises = [
        () => getClientData({ client_id: clientUser.client_id }),
        () => getJobsAndHiredCount({ client_id: clientUser.client_id })
      ]
      const [clientDetails, jobData] = await Promise.all(clientPromises.map(promise => promise()))

      const companyAccountSettings = {
        companyId: clientDetails.client_id,
        companyName: clientDetails.client_name,
        street: clientDetails.address1,
        city: clientDetails.city,
        state: clientDetails.state,
        zip: clientDetails.zip,
        registrationDate: clientDetails.registration_date,
        email: user.email,
        phoneNumber: clientDetails.phone_number,
        smsNotification: !!userDetails.notify_sms,
        emailNotification: !!userDetails.notify_email,
        website: clientDetails.website,
        summary: clientDetails.summary,
        title: clientDetails.title,
        rating: clientDetails.rating,
        timezone: '',
        profilePic: userDetails.profile_image,
        followers: noOfFollowers,
        following: noOfFollowings,
        jobsPosted: jobData.noOfJobsPosted,
        hires: jobData.noOfHires
      }

      return companyAccountSettings
    } catch (err) {
      logger.error(getErrorMessageForService('GetCompanyProfileSettingsService'), err)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
