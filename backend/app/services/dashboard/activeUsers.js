import ServiceBase from '../../common/serviceBase'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  }
}

export class ActiveUsers extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    // const userClientId = await getClientIdByUserId({ userId: this.user_id })
    // TODO
  }
}
