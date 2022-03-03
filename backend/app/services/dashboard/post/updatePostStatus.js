import ServiceBase from '../../../common/serviceBase'
import {
  getErrorMessageForService,
  validateImageFile,
  uploadFileToIPFS,
  getUserActivityById,
  updatePostStatus,
  checkVisibility
} from '../../helper'
import logger from '../../../common/logger'
import { ERRORS, MESSAGES } from '../../../utils/errors'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  file: {
    presence: false
  },
  user_activity_id: {
    presence: { allowEmpty: false }
  },
  remove_image: {
    presence: { allowEmpty: false }
  },
  text: {
    presence: { allowEmpty: false }
  },
  permission: {
    presence: { allowEmpty: false }
  }
}

export class UpdatePostStatusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      let url
      const postData = await getUserActivityById({ user_activity_id: this.user_activity_id })
      if (!postData) {
        this.addError(ERRORS.NOT_FOUND, MESSAGES.POST_STATUS_NOT_EXIST)
        return
      }

      if (postData.user_id !== this.user_id) {
        this.addError(ERRORS.UNAUTHORIZED)
        return
      }

      const isValidUser = await checkVisibility({
        activity_permission: postData.activity_permission,
        user_id: this.user_id,
        owner_id: postData.user_id
      })

      if (isValidUser) {
        if (this.file) {
          const { isValidFileSize, isValidImage } = validateImageFile(this.file)
          if (!isValidImage) {
            this.addError(ERRORS.BAD_DATA, MESSAGES.INVALID_IMAGE_FILE)
            return
          }

          if (!isValidFileSize) {
            this.addError(ERRORS.BAD_DATA, MESSAGES.INVALID_IMAGE_FILE_SIZE)
            return
          }

          try {
          // upload file to IPFS
            url = await uploadFileToIPFS(this.file.buffer)
          } catch (e) {
            this.addError(ERRORS.BAD_DATA, MESSAGES.IPFS_FILE_UPLOAD_ERROR)
            return
          }
        }

        const updateUserActivity = {
          user_id: postData.user_id,
          user_activity_id: postData.user_activity_id,
          activity_value: this.text,
          activity_permission: this.permission,
          activity_custom: url || postData.activity_custom
        }
        if (this.remove_image === 'true') {
          updateUserActivity['activity_custom'] = null
        }
        await updatePostStatus(updateUserActivity)

        return updateUserActivity
      } else {
        this.addError(ERRORS.UNAUTHORIZED)
        return
      }
    } catch (e) {
      logger.error(getErrorMessageForService('UpdatePostStatusService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
