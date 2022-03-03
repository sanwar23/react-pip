import ServiceBase from '../../common/serviceBase'
import { User } from '../../db/models'
import { getOne } from '../helper'
import { ERRORS } from '../../utils/errors'

const constraints = {
  data: {
    presence: { allowEmpty: false }
  },
  user_id: {
    presence: { allowEmpty: false }
  }
}

export class UpdateUserDataService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const user = await getOne({ data: { user_id: this.user_id }, model: User, attributes: ['user_id'] })
    if (!(user && user['user_id'])) {
      this.addError(ERRORS.BAD_DATA)
      return
    }

    await User.update(this.data, { where: { user_id: this.user_id } })

    return true
  }
}
