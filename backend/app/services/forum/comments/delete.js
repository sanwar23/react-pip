import ServiceBase from '../../../common/serviceBase'
import { deleteForumComment, getErrorMessageForService } from '../../helper'
import logger from '../../../common/logger'
import { ERRORS } from '../../../utils/errors'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  id: {
    presence: { allowEmpty: false }
  },
  topic_id: {
    presence: { allowEmpty: false }
  }
}

export class ForumDeleteCommentService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user_id, topic_id, id } = this.filteredArgs
    try {
      const deletedComment = await deleteForumComment({
        id,
        topic_id,
        user_id
      })

      return {
        message: 'Forum comment deleted Successfully',
        deletedComment
      }
    } catch (err) {
      logger.error(getErrorMessageForService('ForumDeleteCommentService'), err)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
