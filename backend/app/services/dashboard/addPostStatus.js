import ServiceBase from '../../common/serviceBase'
import { XUserActivity } from '../../db/models'
import {
  createNewEntity,
  getErrorMessageForService,
  validateImageFile,
  uploadFileToIPFS
} from '../helper'
import logger from '../../common/logger'
import { ERRORS, MESSAGES } from '../../utils/errors'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  file: {
    presence: false
  },
  activityPermission: {
    presence: { allowEmpty: false }
  },
  text: {
    presence: { allowEmpty: false }
  }
}

export class AddPostStatusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      let url
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

      const newUserActivity = {
        user_id: this.user_id,
        record_id: 0,
        record_type: 'activity',
        activity_type: 'status',
        activity_value: this.text,
        activity_custom: url || null,
        activity_permission: this.activityPermission || 'public'
      }

      const statusActivity = await createNewEntity({
        model: XUserActivity,
        data: newUserActivity
      })

      return statusActivity
    } catch (e) {
      logger.error(getErrorMessageForService('AddPostStatusService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
