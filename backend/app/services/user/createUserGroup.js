import ServiceBase from '../../common/serviceBase'
import { UserGroup } from '../../db/models'

const constraints = {
  id: {
    presence: { allowEmpty: false }
  },
  full_name: {
    presence: { allowEmpty: false }
  }
}

export class CreateUserGroupService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const userGroupObj = {
      user_group: this.id,
      group_name: this.full_name
    }
    const newUserGroup = await UserGroup.create(userGroupObj)
    return newUserGroup
  }
}
