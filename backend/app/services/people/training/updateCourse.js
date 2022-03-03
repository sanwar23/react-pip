import ServiceBase from '../../../common/serviceBase'
import { ERRORS, MESSAGES } from '../../../utils/errors'
import logger from '../../../common/logger'
import { getErrorMessageForService, uploadFileToIPFS, validateImageFile, validateVideoFile } from '../../helper'
import {
  getCourseById, updateCourse, formatCourseData, getCategoryTitleById, addRequiredCourses, deleteRequiredCourses,
  getRequiredCoursesById, getRequiredCoursesData
} from '../../helper/people'

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

export class PeopleUpdateCourseService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let course = JSON.parse(this.course)
    const { user_id } = this.filteredArgs

    try {
      // Upload Course Thumbnail
      let imageUrl = course.contentSection.thumbnailImage
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
      let videoUrl = course.contentSection.introductionVideo
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

      course = {
        ...course,
        image_url: imageUrl,
        video_url: videoUrl
      }

      await updateCourse({ course })

      await deleteRequiredCourses({ course_id: course.courseId })

      if (course.informationSection && course.informationSection.requiredCourses) {
        await addRequiredCourses({
          course_id: course.courseId, requiredCourses: course.informationSection.requiredCourses
        })
      }

      const courseData = await getCourseById({ course_id: course.courseId, user_id })

      let courseDetails = {}

      if (courseData) {
        const categoryTitle = await getCategoryTitleById({ category_id: courseData.category_id })
        const requiredCourses = await getRequiredCoursesById({ course_id: course.courseId })
        let requiredCoursesData = []

        if (requiredCourses && requiredCourses.length) {
          requiredCoursesData = await getRequiredCoursesData({ requiredCourses, user_id })
        }

        courseDetails = formatCourseData({ course: courseData, categoryTitle, requiredCourses: requiredCoursesData })
      }

      return {
        courseData: courseDetails,
        message: course.status === 'published' ? 'Course successfully published!' : 'Course successfully updated!'
      }
    } catch (e) {
      logger.error(getErrorMessageForService('PeopleUpdateCourseService'), e)
      this.addError(ERRORS.INTERNAL)
    }
  }
}
