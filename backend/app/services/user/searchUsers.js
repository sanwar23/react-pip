import _ from 'lodash'
import ServiceBase from '../../common/serviceBase'
import { SqlHelper } from '../../utils/sql'
import logger from '../../common/logger'
import { ERRORS } from '../../utils/errors'
import { getErrorMessageForService, formatUserSearchResults, searchUsers } from '../helper'

const constraints = {
  search_string: {
    presence: { allowEmpty: false }
  },
  offset: {
    presence: { allowEmpty: true }
  }
}

export class SearchUsersService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { search_string, offset } = this.filteredArgs

      const searchResults = await SqlHelper.select(searchUsers({ searchString: search_string, offset }))

      if (searchResults && !_.isEmpty(searchResults)) {
        return {
          usersList: formatUserSearchResults({ users: searchResults }),
          count: searchResults[0].count
        }
      }

      return {
        usersList: [],
        count: 0
      }
    } catch (e) {
      logger.error(getErrorMessageForService('SearchUsersService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
