import _ from 'lodash'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../../../config/app'
import { XUserActivity, Sequelize, XClient, User, UserDetail, XQodResourceDef } from '../../db/models'
import { getUserDetails, getUserById } from './user'
import { APP_ERROR_CODES } from '../../utils/errors'
import { CONSTANTS } from '../../utils/success'
import { getAll, getOne } from './crud'
import SendResetEmailVerificationMailService from '../email/sendResetEmailVerificationMail'

export const updateProfileSettings = async ({ user, updatedData, updatedDataType }) => {
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
      result = await UserDetail.update({
        street_address: updatedData.street,
        city: updatedData.city,
        state: updatedData.state,
        zip: updatedData.zip
      },
      { where: { user_id: user.user_id } })
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

    // Update Active
    case 'active': {
      result = await UserDetail.update({
        is_online: updatedData.active
      },
      { where: { user_id: user.user_id } })
      break
    }

    // Update Mobile Phone number
    case 'mobile phone': {
      result = await UserDetail.update({
        mobile_phone: updatedData.mobileNumber
      },
      { where: { user_id: user.user_id } })
      break
    }

    // Update Home Phone number
    case 'home phone': {
      result = await UserDetail.update({
        home_phone: updatedData.homePhone
      },
      { where: { user_id: user.user_id } })
      break
    }

    // Update Gender
    case 'gender': {
      result = await UserDetail.update({
        gender: updatedData.gender
      },
      { where: { user_id: user.user_id } })
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

    // Update Agent Info
    case 'Agent Info': {
      result = await UserDetail.update({
        work_title: updatedData.title,
        work_overview: updatedData.summary,
        years_of_experience: updatedData.yearsOfExperience,
        highest_education: updatedData.highestEducation
      },
      { where: { user_id: user.user_id } })
      break
    }

    // Update Languages
    case 'Languages': {
      result = await UserDetail.update({
        primary_language: updatedData.languages[0],
        other_languages: updatedData.languages.slice(1).join()
      },
      { where: { user_id: user.user_id } })
      break
    }

    default : {
      break
    }
  }
  return result
}

export const fetchAgentRatings = async ({ agent_user_id }) => {
  let ratings = await XUserActivity.findAll({
    where: {
      record_type: 'user',
      record_id: agent_user_id,
      activity_type: ['rating_performance', 'rating_teamplayer', 'rating_interaction', 'rating_dependability']
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
    performance: 0,
    teamplayer: 0,
    interaction: 0,
    dependability: 0,
    totalAverageRating: 0,
    totalAverageRaters: 0
  }

  ratings.map(item => {
    result[item['activity_type'].split('_')[1]] = parseFloat(item.average_rating).toFixed(1)
    result.totalAverageRaters = item.count
  })

  result.totalAverageRating = result.totalAverageRaters === 0
    ? parseFloat(0)
    : parseFloat((Number(result.performance) +
      Number(result.teamplayer) +
      Number(result.interaction) +
      Number(result.dependability)
    ) / 4).toFixed(1)
  return result
}

export const fetchAgentReviews = async ({ user_id, agent_user_id, type }) => {
  let activityQuery = {
    record_type: 'user',
    activity_type: ['rating_performance', 'rating_teamplayer', 'rating_interaction', 'rating_dependability']
  }
  if (type === 'received') {
    activityQuery = {
      ...activityQuery,
      record_id: agent_user_id
    }
  } else if (type === 'given') {
    activityQuery = {
      ...activityQuery,
      record_type: 'client',
      activity_type: ['rating_culture', 'rating_leadership', 'rating_career', 'rating_compensation'],
      user_id: agent_user_id
    }
  }

  let reviewsList = await XUserActivity.findAll({
    where: activityQuery,
    attributes: [
      ['user_activity_id', 'id'],
      'record_id',
      'user_id',
      ['activity_custom', 'reviewText'],
      [Sequelize.fn('AVG', Sequelize.col('activity_value')), 'rating']
    ],
    group: [type === 'received' ? 'user_id' : 'record_id']
  })

  reviewsList = reviewsList.map(item => item.get({ plain: true }))

  const reviewDetails = Promise.all(reviewsList.map(async (review) => {
    const userDetail = await getUserDetails({ user_id: type === 'received' ? review.user_id : review.record_id })
    const client = await getOne({
      model: XClient,
      data: { client_id: type === 'received' ? review.user_id : review.record_id }
    })

    return {
      ...review,
      rating: parseFloat(review.rating).toFixed(1),
      userDetails: {
        profileName: client.client_name,
        profilePic: userDetail.profile_image,
        profileTitle: userDetail.work_title
      }
    }
  }))
  return reviewDetails
}

export const addAgentReviewAndRating = async ({ user_id, agent_user_id, reviewData }) => {
  const ratingTypes = [
    { ratingType: 'rating_performance', ratingValue: reviewData.performanceRating },
    { ratingType: 'rating_teamplayer', ratingValue: reviewData.teamPlayerRating },
    { ratingType: 'rating_interaction', ratingValue: reviewData.customerInteractionRating },
    { ratingType: 'rating_dependability', ratingValue: reviewData.dependabilityRating }
  ]

  const ratingActivities = ratingTypes.map((item, index) => {
    const ratingActivity = {
      user_id,
      record_type: 'user',
      record_id: agent_user_id,
      activity_type: item.ratingType,
      activity_value: item.ratingValue
    }

    // Adding review text to custom activity
    if (index === 0 && !_.isEmpty(reviewData.reviewText)) { ratingActivity.activity_custom = reviewData.reviewText }

    return ratingActivity
  })

  return XUserActivity.bulkCreate(ratingActivities)
}

export const getAgentReviewByUser = ({ user_id, agent_user_id }) => {
  const agentReview = getAll({
    model: XUserActivity,
    data: {
      user_id: user_id,
      record_type: 'user',
      record_id: agent_user_id,
      activity_type: ['rating_performance', 'rating_teamplayer', 'rating_interaction', 'rating_dependability']
    }
  })
  return agentReview
}

export const getAddReviewAccessForAgent = async ({ user_id, agent_user_id }) => {
  const user = await getUserById({ user_id })
  if (!(user.user_code === 'employer')) {
    return false
  }

  const userReview = await getAgentReviewByUser({ user_id, agent_user_id })
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

export const getUserTalentData = async ({ user_id }) => {
  return await XQodResourceDef.findOne({ where: { user_id }, raw: true })
}

export const createUserTalentData = async ({
  user_id,
  status,
  desired_min_pay,
  desired_employment_type,
  desired_location_type,
  is_visible
}) => {
  return await XQodResourceDef.create({
    user_id,
    status,
    desired_min_pay,
    desired_employment_type,
    desired_location_type,
    is_visible
  })
}

export const updateUserTalentData = async ({
  user_id,
  status,
  desired_min_pay,
  desired_employment_type,
  desired_location_type,
  is_visible
}) => {
  return await XQodResourceDef.update({
    status,
    desired_min_pay,
    desired_employment_type,
    desired_location_type,
    is_visible
  }, { where: { user_id } })
}

export const updateAgentUserRating = async ({ agent_user_id, rating }) => {
  await UserDetail.update({
    rating: rating
  }, { where: { user_id: agent_user_id } })
}
