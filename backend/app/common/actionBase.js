import _ from 'lodash'
import of from 'await-of'

export default class ActionBase {
  static filterResponse (response) {
    if (_.isObject(response[1])) {
      // Error object output
      // Object.keys = []
      // Reflect.ownKeys = ['message', 'stack']
      // When manually throwing the error
      const errorMessage = response[1] && response[1].message
      // When error throwing by the fastest validator
      const errors = response[1] && response[1].errors
      // Default message
      const defaultMessage = 'Something Went Wrong!!'
      const error = errors || errorMessage || defaultMessage
      response[1] = {
        errorType: (response[1].name && response[1].name !== 'Error') ? response[1].name : 'Internal service error',
        error
      }
    }
    return response
  }

  static async execute (request, context, logger) {
    const instance = new this()
    const result = await instance.perform(request, context, logger)
    return result
  }

  static async run (request, context, logger) {
    const instance = new this()
    const result = await of(instance.perform(request, context, logger))
    return this.filterResponse(result)
  }

  async perform (requestData, context, logger) {
    throw new Error('Perform method not defined')
  }
}
