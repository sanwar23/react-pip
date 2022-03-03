import ServiceBase from '../../common/serviceBase'
import { UserDetail } from '../../db/models'
import {
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
  }
}

export class UploadProfileImageService extends ServiceBase {
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
      const updateProfileImage = {
        user_id: this.user_id,
        profile_image: url || null
      }

      await UserDetail.update({
        profile_image: updateProfileImage.profile_image
      },
      { where: { user_id: updateProfileImage.user_id } })

      return ({
        profilePicUrl: url
      })
    } catch (e) {
      logger.error(`${getErrorMessageForService('UploadProfileImageService')} ${e}`)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
