import ServiceBase from '../../common/serviceBase'
import { getClientRating, getClientLikesCount, getClientSubscribersCount } from '../user/activity/helper'
import { getClientIdByUserId } from '../helper/user'
import { getErrorMessageForService } from '../helper'
import { ERRORS } from '../../utils/errors'
import logger from '../../common/logger'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  }
}

export class CommunityRepService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const client = await getClientIdByUserId({ user_id: this.user_id })
      if (client && client.client_id) {
        const { client_id } = client
        const promises = [
          () => getClientRating({ client_id }),
          () => getClientLikesCount({ client_id }),
          () => getClientSubscribersCount({ client_id })
        ]
        const [{ rating, raters }, { likes }, { subscribers }] = await Promise.all(promises.map(promise => promise()))
        return {
          rating,
          raters,
          likes,
          subscribers
        }
      } else {
        return {
          rating: 0,
          raters: 0,
          likes: 0,
          subscribers: 0
        }
      }
    } catch (err) {
      logger.error(getErrorMessageForService('CommunityRepService'), err)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
