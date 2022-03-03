import ServiceBase from '../../../common/serviceBase'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import logger from '../../../common/logger'
import {
  getErrorMessageForService, uploadFileToIPFS, validateImageFile, validateVideoFile, addRequiredCourses
} from '../../helper'
import { addNewCourse } from '../../helper/people'

const constraints = {
  user_id: {
    presence: { allowEmpty: false }
  },
  course: {
    presence: { allowEmpty: false }
  },
  imageFile: {
    presence: false
  },
  introFile: {
    presence: false
  }
}

export class PeopleAddNewCourseService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let course = JSON.parse(this.course)

    try {
      // Upload Course Thumbnail
      let imageUrl = ''
      if (this.imageFile) {
        const { isValidFileSize, isValidImage } = validateImageFile(this.imageFile)

        if (!isValidImage) {
          this.addError(ERRORS.BAD_DATA, MESSAGES.INVALID_IMAGE_FILE)
          return
        }

        if (!isValidFileSize) {
          this.addError(ERRORS.BAD_DATA, MESSAGES.INVALID_IMAGE_FILE_SIZE)
          return
        }

        try {
          imageUrl = await uploadFileToIPFS(this.imageFile.buffer)
        } catch (e) {
          this.addError(ERRORS.BAD_DATA, MESSAGES.IPFS_FILE_UPLOAD_ERROR)
          return
        }
      }

      // Upload Introduction Video
      let videoUrl = ''
      if (this.introFile) {
        const { isValidFileSize, isValidVideo } = validateVideoFile(this.introFile)

        if (!isValidVideo) {
          this.addError(ERRORS.BAD_DATA, MESSAGES.INVALID_VIDEO_FILE)
          return
        }

        if (!isValidFileSize) {
          this.addError(ERRORS.BAD_DATA, MESSAGES.INVALID_VIDEO_FILE_SIZE)
          return
        }

        try {
          videoUrl = await uploadFileToIPFS(this.introFile.buffer)
        } catch (e) {
          this.addError(ERRORS.BAD_DATA, MESSAGES.IPFS_FILE_UPLOAD_ERROR)
          return
        }
      }

      if (imageUrl) {
        course = {
          ...course,
          image_url: imageUrl
        }
      }

      if (videoUrl) {
        course = {
          ...course,
          video_url: videoUrl
        }
      }

      // TODO: Blockchain part

      const addedCourse = await addNewCourse({ course })

      if (course.informationSection && course.informationSection.requiredCourses &&
      course.informationSection.requiredCourses.length) {
        let requiredCourses = course.informationSection.requiredCourses

        // To store the course IDs of required courses
        if (course.informationSection.requiredCourses[0].courseId) {
          requiredCourses = course.informationSection.requiredCourses.map((course) => course.courseId)
        }

        await addRequiredCourses({
          course_id: addedCourse.course_id,
          requiredCourses
        })
      }

      const courseData = { courseId: addedCourse.course_id }

      return {
        courseData,
        message: course.status === 'published' ? 'Course successfully published!' : 'Course successfully created!'
      }
    } catch (e) {
      logger.error(getErrorMessageForService('PeopleAddNewCourseService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
