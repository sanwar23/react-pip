import ServiceBase from '../../common/serviceBase'
import { ERRORS, MESSAGES } from '../../utils/errors'
import logger from '../../common/logger'
import {
  getErrorMessageForService,
  getClientData,
  getUserDetailsByClientId,
  getUserById,
  getUserDetails,
  getClientIdByUserId
} from '../helper'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  user_details_id: {
    presence: { allowEmpty: false }
  }
}

export default class UserDetailsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { user_details_id } = this.filteredArgs
      const user = await getUserById({ user_id: user_details_id })
      let userDetails
      if (user && user.user_code === 'employer') {
        const clientUser = await getClientIdByUserId({ user_id: user_details_id })
        const clientDetails = await getClientData({ client_id: clientUser.client_id })
        if (!clientDetails) {
          this.addError(ERRORS.NOT_FOUND, MESSAGES.CLIENT_NOT_EXIST)
          return
        }
        userDetails = await getUserDetailsByClientId({ client_id: clientDetails.client_id })
        const UserDetails = {
          registrationDate: clientDetails.registration_date,
          name: clientDetails.client_name,
          id: clientDetails.client_id,
          title: clientDetails.title,
          summary: clientDetails.summary,
          location: `${clientDetails.city}, ${clientDetails.state}`,
          companyImg: userDetails.profile_image,
          rating: userDetails.rating,
          userCode: user.user_code
        }
        return UserDetails
      }
      userDetails = await getUserDetails({ user_id: user_details_id })
      const UserDetails = {
        registrationDate: userDetails.registration_date,
        name: `${userDetails.first_name}, ${userDetails.last_name}`,
        id: userDetails.user_id,
        title: userDetails.work_title,
        summary: userDetails.work_overview,
        location: `${userDetails.city}, ${userDetails.state}`,
        companyImg: userDetails.profile_image,
        rating: userDetails.rating,
        userCode: 'agent'
      }
      return UserDetails
    } catch (err) {
      logger.error(`${getErrorMessageForService('UserDetailsService')} ${err}`)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
