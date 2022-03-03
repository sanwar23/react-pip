import { GraphQLError } from 'graphql'

class ValidationError extends GraphQLError {
  constructor (errors) {
    super('The request is invalid.')
    this.code = 451 // TODO
    this.reason = errors
  }
}

export default ValidationError
