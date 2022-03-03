import ServiceBase from '../../../common/serviceBase'
import { updateForumComment, getErrorMessageForService } from '../../helper'
import logger from '../../../common/logger'
import { ERRORS } from '../../../utils/errors'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  topic_id: {
    presence: { allowEmpty: false }
  },
  comment: {
    presence: { allowEmpty: false }
  },
  id: {
    presence: { allowEmpty: false }
  }
}

export class ForumUpdateCommentService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user_id, topic_id, comment, id } = this.filteredArgs
    try {
      const updatedComment = await updateForumComment({
        topic_id,
        comment,
        user_id,
        id
      })

      return {
        message: 'Forum comment updated Successfully',
        updatedComment
      }
    } catch (err) {
      logger.error(getErrorMessageForService('ForumUpdateCommentService'), err)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
