import ServiceBase from '../../../common/serviceBase'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService, getClientData, getUserDetailsByClientId, getConnectionType, getNoOfFollowersAndFollowings, getJobsAndHiredCount } from '../../helper'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  client_id: {
    presence: { allowEmpty: false }
  }
}

export class CompanyDetailsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { client_id, user_id } = this.filteredArgs
      const clientDetails = await getClientData({ client_id })

      if (!clientDetails) {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.CLIENT_NOT_EXIST)
        return
      }

      const promises = [
        () => getUserDetailsByClientId({ client_id: clientDetails.client_id }),
        () => getConnectionType({ follower_id: user_id, user_to_follow_id: client_id }),
        () => getNoOfFollowersAndFollowings({ user_id: client_id }),
        () => getJobsAndHiredCount({ client_id })
      ]
      const [userDetails, connectionType, followData, jobData] = await Promise.all(promises.map(promise => promise()))
      const companyDetails = {
        userId: userDetails.user_id,
        registrationDate: clientDetails.registration_date,
        companyName: clientDetails.client_name,
        clientId: clientDetails.client_id,
        title: clientDetails.title,
        summary: clientDetails.summary,
        location: `${clientDetails.city}, ${clientDetails.state}`,
        companyImg: userDetails.profile_image,
        rating: clientDetails.rating,
        isFollowing: connectionType === 'following',
        followers: followData.noOfFollowers,
        following: followData.noOfFollowings,
        jobsPosted: jobData.noOfJobsPosted,
        hires: jobData.noOfHires
      }

      return companyDetails
    } catch (err) {
      logger.error(`${getErrorMessageForService('CompanyDetailsService')} ${err}`)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
