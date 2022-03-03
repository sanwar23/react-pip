import ServiceBase from '../../../../common/serviceBase'
import { getAllJobCategories, getErrorMessageForService } from '../../../helper'
import logger from '../../../../common/logger'
import { ERRORS } from '../../../../utils/errors'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  search_keyword: {
    presence: false
  }
}

export class FetchJobCategoriesService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { search_keyword } = this.filteredArgs
      const categories = await getAllJobCategories({ search_keyword })
      return categories
    } catch (err) {
      logger.error(`${getErrorMessageForService('FetchJobCategoriesService')} ${err}`)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
