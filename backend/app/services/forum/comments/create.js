import ServiceBase from '../../../common/serviceBase'
import { createForumComment, getErrorMessageForService } from '../../helper'
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
  }
}

export class ForumCreateCommentService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { user_id, topic_id, comment } = this.filteredArgs
    try {
      const newComment = await createForumComment({
        topic_id,
        comment,
        user_id
      })

      return {
        message: 'Forum comment created Successfully',
        newComment: {
          id: newComment.user_activity_id,
          comment: newComment.activity_value,
          createdAt: newComment.created_on
        }
      }
    } catch (err) {
      logger.error(getErrorMessageForService('ForumCreateCommentService'), err)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
