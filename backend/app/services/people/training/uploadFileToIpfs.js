import ServiceBase from '../../../common/serviceBase'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService, uploadFileToIPFS, validateAudioFile, validateVideoFile } from '../../helper'
import _ from 'lodash'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  file: {
    presence: { allowEmpty: false }
  },
  file_type: {
    presence: { allowEmpty: false }
  }
}

export class PeopleUploadFileToIpfsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      let fileUrl = ''
      if (this.file) {
        let isValidFileSize, isValidFile

        if (_.isEqual(this.file_type, 'audio')) {
          const { isValidFileSize: isValidAudioFileSize, isValidAudio } = validateAudioFile(this.file)
          isValidFileSize = isValidAudioFileSize
          isValidFile = isValidAudio
        }

        if (_.isEqual(this.file_type, 'video')) {
          const { isValidFileSize: isValidVideoFileSize, isValidVideo } = validateVideoFile(this.file)
          isValidFileSize = isValidVideoFileSize
          isValidFile = isValidVideo
        }

        if (!isValidFile) {
          if (_.isEqual(this.file_type, 'audio')) {
            this.addError(ERRORS.BAD_DATA, MESSAGES.INVALID_AUDIO_FILE)
          }
          if (_.isEqual(this.file_type, 'video')) {
            this.addError(ERRORS.BAD_DATA, MESSAGES.INVALID_VIDEO_FILE)
          }
          return
        }

        if (!isValidFileSize) {
          if (_.isEqual(this.file_type, 'audio')) {
            this.addError(ERRORS.BAD_DATA, MESSAGES.INVALID_AUDIO_FILE_SIZE)
          }
          if (_.isEqual(this.file_type, 'video')) {
            this.addError(ERRORS.BAD_DATA, MESSAGES.INVALID_VIDEO_FILE_SIZE)
          }
          return
        }

        try {
          fileUrl = await uploadFileToIPFS(this.file.buffer)
        } catch (e) {
          this.addError(ERRORS.BAD_DATA, MESSAGES.IPFS_FILE_UPLOAD_ERROR)
          return
        }
      }

      return {
        fileUrl,
        message: 'File uploaded successfully!'
      }
    } catch (e) {
      logger.error(getErrorMessageForService('PeopleUploadFileToIpfsService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
