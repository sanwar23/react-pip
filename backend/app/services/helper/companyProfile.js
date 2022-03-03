import bcrypt from 'bcrypt'
import { XClient, User, UserDetail, XUserActivity, XClientUser, Sequelize } from '../../db/models'
import { APP_ERROR_CODES } from '../../utils/errors'
import jwt from 'jsonwebtoken'
import config from '../../../config/app'
import { CONSTANTS } from '../../utils/success'
import SendResetEmailVerificationMailService from '../email/sendResetEmailVerificationMail'
import { getAll, getOne } from './crud'
import _ from 'lodash'
import { getUserDetails, getUserById } from './user'

export const updateProfileSettings = async ({ user, clientUser, updatedData, updatedDataType }) => {
  let result
  switch (updatedDataType) {
    // Update Password
    case 'password' : {
      if (!await user.comparePassword(updatedData.currentPassword)) {
        throw new Error(APP_ERROR_CODES.INCORRECT_PASSWORD)
      }

      const salt = bcrypt.genSaltSync(10)
      const newPassword = bcrypt.hashSync(updatedData.newPassword, salt)

      result = await User.update({
        pass: newPassword
      },
      { where: { user_id: user.user_id } })
      break
    }

    // Update Address
    case 'address' : {
      result = await XClient.update({
        address1: updatedData.street,
        city: updatedData.city,
        state: updatedData.state,
        zip: updatedData.zip
      },
      { where: { client_id: clientUser.client_id } })
      break
    }

    // Update Sms Notifications
    case 'Sms Notification': {
      result = await UserDetail.update({
        notify_sms: updatedData.smsNotification
      },
      { where: { user_id: user.user_id } })
      break
    }

    // Update Email Notifications
    case 'Email Notification': {
      result = await UserDetail.update({
        notify_email: updatedData.emailNotification
      },
      { where: { user_id: user.user_id } })
      break
    }

    // Update Phone number
    case 'number': {
      result = await XClient.update({
        phone_number: updatedData.phoneNumber
      },
      { where: { client_id: clientUser.client_id } })
      break
    }

    // Update Website
    case 'website': {
      result = await XClient.update({
        website: updatedData.website
      },
      { where: { client_id: clientUser.client_id } })
      break
    }

    // Update Email
    case 'email': {
      if (await User.findOne({ where: { email: updatedData.email }, raw: true })) {
        throw new Error(APP_ERROR_CODES.EMAIL_NOT_AVAILABLE)
      } else {
        const token = jwt.sign({
          email: user.email,
          user_id: user.user_id,
          user_code: user.user_code,
          token_type: CONSTANTS.RESET_EMAIL_TOKEN_TYPE,
          newEmail: updatedData.email
        },
        config.get('jwt.emailVerificationTokenSecret'),
        { expiresIn: config.get('jwt.emailVerificationTokenExpiry') })

        SendResetEmailVerificationMailService.execute({
          email: updatedData.email,
          token
        })
      }
      break
    }

    case 'Company Info': {
      result = await XClient.update({
        title: updatedData.title,
        summary: updatedData.summary
      },
      { where: { client_id: clientUser.client_id } })
      break
    }

    default : {
      break
    }
  }
  return result
}

export const addCompanyReviewAndRating = async ({ user_id, client_id, reviewData }) => {
  const ratingTypes = [
    { ratingType: 'rating_culture', ratingValue: reviewData.cultureRating },
    { ratingType: 'rating_leadership', ratingValue: reviewData.leadershipRating },
    { ratingType: 'rating_career', ratingValue: reviewData.careerRating },
    { ratingType: 'rating_compensation', ratingValue: reviewData.compensationRating }
  ]

  const ratingActivities = ratingTypes.map((item, index) => {
    const ratingActivity = {
      user_id,
      record_type: 'client',
      record_id: client_id,
      activity_type: item.ratingType,
      activity_value: item.ratingValue
    }

    // Adding review text to custom activity
    if (index === 0 && !_.isEmpty(reviewData.reviewText)) { ratingActivity.activity_custom = reviewData.reviewText }

    return ratingActivity
  })

  return XUserActivity.bulkCreate(ratingActivities)
}

export const fetchCompanyRatings = async ({ client_id }) => {
  let ratings = await XUserActivity.findAll({
    where: {
      record_type: 'client',
      record_id: client_id,
      activity_type: ['rating_culture', 'rating_leadership', 'rating_career', 'rating_compensation']
    },
    attributes: [
      'activity_type',
      [Sequelize.fn('AVG', Sequelize.col('activity_value')), 'average_rating'],
      [Sequelize.fn('COUNT', Sequelize.col('activity_value')), 'count']
    ],
    group: ['activity_type']
  })

  ratings = ratings.map(item => item.get({ plain: true }))

  const result = {
    culture: 0,
    leadership: 0,
    career: 0,
    compensation: 0,
    totalAverageRating: 0,
    totalAverageRaters: 0
  }

  ratings.map(item => {
    result[item['activity_type'].split('_')[1]] = parseFloat(item.average_rating).toFixed(1)
    result.totalAverageRaters = item.count
  })

  result.totalAverageRating = result.totalAverageRaters === 0
    ? parseFloat(0)
    : parseFloat((Number(result.career) +
      Number(result.compensation) +
      Number(result.leadership) +
      Number(result.culture)
    ) / 4).toFixed(1)
  return result
}

export const getClientReviewByUser = ({ user_id, client_id }) => {
  const clientReview = getAll({
    model: XUserActivity,
    data: {
      user_id: user_id,
      record_type: 'client',
      record_id: client_id,
      activity_type: ['rating_culture', 'rating_leadership', 'rating_career', 'rating_compensation']
    }
  })
  return clientReview
}

export const fetchCompanyReviews = async ({ user_id, client_id, type }) => {
  let activityQuery = {
    record_type: 'client',
    activity_type: ['rating_culture', 'rating_leadership', 'rating_career', 'rating_compensation']
  }
  if (type === 'received') {
    activityQuery = {
      ...activityQuery,
      record_id: client_id
    }
  } else if (type === 'given') {
    const client = await getOne({
      model: XClientUser,
      data: { client_id }
    })
    if (client) {
      activityQuery = {
        ...activityQuery,
        record_type: 'user',
        activity_type: ['rating_performance', 'rating_teamplayer', 'rating_interaction', 'rating_dependability'],
        user_id: client.user_id
      }
    } else return []
  }

  let reviewsList = await XUserActivity.findAll({
    where: activityQuery,
    attributes: [
      ['user_activity_id', 'id'],
      'user_id',
      'record_id',
      ['activity_custom', 'reviewText'],
      [Sequelize.fn('AVG', Sequelize.col('activity_value')), 'rating']
    ],
    group: [type === 'received' ? 'user_id' : 'record_id']
  })

  reviewsList = reviewsList.map(item => item.get({ plain: true }))

  const reviewDetails = Promise.all(reviewsList.map(async (review) => {
    const userDetail = await getUserDetails({ user_id: type === 'received' ? review.user_id : review.record_id })
    return {
      ...review,
      rating: parseFloat(review.rating).toFixed(1),
      userDetails: {
        profileName: userDetail.first_name + ' ' + userDetail.last_name,
        profilePic: userDetail.profile_image,
        profileTitle: userDetail.work_title
      }
    }
  }))
  return reviewDetails
}

export const getAddReviewAccessForClient = async ({ user_id, client_id }) => {
  const user = await getUserById({ user_id })
  if (!(user.user_code === 'agent')) {
    return false
  }

  const userReview = await getClientReviewByUser({ user_id, client_id })
  if (userReview.length > 0) {
    return false
  }

  // WIP Access Permission for employee or ex employee

  /* const isEmployee = await getOne({
    model: XQodApplication,
    data: {
      user_id,
      client_id,
      status: ['hired', 'resigned', 'terminated']
    }
  })

  if (!isEmployee) {
    return false
  } */

  return true
}

export const updateClientUserRating = async ({ client_id, rating }) => {
  await XClient.update({
    rating: rating
  }, { where: { client_id } })
}
