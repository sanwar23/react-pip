import { XUserActivity, User, XClientUser, sequelize } from '../../../db/models'
import { Op } from 'sequelize'

/* Client Activity Methods */
// Rating Methods

export async function getClientRating ({ client_id }) {
  const ratingAggregate = await XUserActivity.findOne({
    where: {
      record_type: 'client',
      record_id: client_id,
      activity_type: 'rating'
    },
    attributes: [
      [sequelize.fn('sum', sequelize.col('activity_value')), 'sumRating'],
      [sequelize.fn('count', sequelize.col('activity_value')), 'totalRaters']
    ],
    raw: true
  })
  const { sumRating, totalRaters } = ratingAggregate
  if (totalRaters === 0) {
    return { rating: 0, raters: 0 }
  } else return { rating: (sumRating / totalRaters), raters: totalRaters }
}

export async function rateClient ({ user_id, client_id, rating, ratingComment, activity_permission }) {
  const rateActivity = await XUserActivity.create({
    user_id,
    record_type: 'client',
    record_id: client_id,
    activity_type: 'rating',
    activity_value: rating,
    activity_custom: ratingComment,
    activity_permission
  })
  return rateActivity.get({ plain: true })
}

export async function getClientRaters ({ client_id, accessing_user_id }) {
  const clientRaters = await XUserActivity.findAll({
    where: {
      record_type: 'client',
      record_id: client_id,
      activity_type: 'rating'
    },
    attributes: ['activity_value', 'user_id', 'activity_custom', 'created_on', 'activity_permission'],
    raw: true
  })
  const ratingsList = []
  for (const rating of clientRaters) {
    const visible = await checkVisibility({
      accessing_user_id,
      activity_permission: rating.activity_permission,
      record_id: client_id
    })
    if (visible) {
      const userName = await User.findOne({ where: { user_id: rating.user_id }, raw: true, attributes: ['full_name'] })
      ratingsList.push({
        user_id: rating.user_id,
        name: userName !== null ? userName.full_name : userName,
        rating: parseInt(rating.activity_value),
        comment: rating.activity_custom,
        rated_on: rating.created_on
      })
    }
  }
  return ratingsList
}

// Like Methods
export async function likeClient ({ user_id, client_id, activity_permission }) {
  const likeActivity = await XUserActivity.create({
    user_id,
    record_type: 'client',
    record_id: client_id,
    activity_type: 'like',
    activity_value: '1',
    activity_permission
  })
  return likeActivity.get({ plain: true })
}

export async function getClientLikesCount ({ client_id }) {
  const totalLikes = await XUserActivity.sum('activity_value', {
    where: {
      record_type: 'client',
      record_id: client_id,
      activity_type: 'like'
    },
    raw: true
  })
  return { likes: totalLikes }
}

export async function getClientLikers ({ client_id, accessing_user_id }) {
  const clientLikers = await XUserActivity.findAll({
    where: {
      record_type: 'client',
      record_id: client_id,
      activity_type: 'like'
    },
    attributes: ['activity_value', 'user_id', 'activity_permission'],
    raw: true
  })
  const userIds = []
  for (const activity of clientLikers) {
    const visible = await checkVisibility({
      accessing_user_id,
      activity_permission: activity.activity_permission,
      record_id: client_id
    })
    if (visible) userIds.push(activity.user_id)
    else continue
  }
  const likersList = await User.findAll({ where: { user_id: { [Op.in]: userIds } }, raw: true, attributes: ['full_name', 'user_id'] })
  return likersList
}

// Subscribe methods
export async function subscribeClient ({ user_id, client_id, activity_permission }) {
  const subscribeActivity = await XUserActivity.create({
    user_id,
    record_type: 'client',
    record_id: client_id,
    activity_type: 'subscribe',
    activity_value: '1',
    activity_permission
  })
  return subscribeActivity.get({ plain: true })
}

export async function getClientSubscribersCount ({ client_id }) {
  const totalSubscribers = await XUserActivity.sum('activity_value', {
    where: {
      record_type: 'client',
      record_id: client_id,
      activity_type: 'subscribe'
    },
    raw: true
  })
  return { subscribers: totalSubscribers }
}

export async function getClientSubscribers ({ client_id, accessing_user_id }) {
  const clientSubscribers = await XUserActivity.findAll({
    where: {
      record_type: 'client',
      record_id: client_id,
      activity_type: 'subscribe'
    },
    attributes: ['activity_value', 'user_id', 'activity_permission'],
    raw: true
  })
  const userIds = []
  for (const activity of clientSubscribers) {
    const visible = await checkVisibility({
      accessing_user_id,
      activity_permission: activity.activity_permission,
      record_id: client_id
    })
    if (visible) userIds.push(activity.user_id)
  }
  const subscribersList = await User.findAll({ where: { user_id: { [Op.in]: userIds } }, raw: true, attributes: ['full_name', 'user_id'] })
  return subscribersList
}

async function checkVisibility ({ activity_permission, record_id, accessing_user_id }) {
  let result = false
  let user, userLevel
  switch (activity_permission) {
    case 'public':
      result = true
      break

    case 'followers':
      user = await XUserActivity.findOne({
        where: {
          user_id: accessing_user_id,
          record_type: 'client',
          record_id,
          activity_type: 'connection',
          activity_value: { [Op.in]: ['following', 'connected'] }
        }
      })
      if (user !== null) result = true
      break

    case 'company' :
      user = await XClientUser.findOne({
        where: {
          client_id: record_id,
          user_id: accessing_user_id
        },
        raw: true
      })
      if (user !== null) result = true
      break

    case 'admins' :
      user = await XClientUser.findOne({
        where: {
          client_id: record_id,
          user_id: accessing_user_id
        }
      })
      userLevel = await User.findOne({
        where: {
          user_id: accessing_user_id
        },
        raw: true,
        attributes: ['user_level']
      })
      if (user !== null && userLevel.user_level === 8) result = true
      break

    case 'managers' :
      user = await XClientUser.findOne({
        where: {
          client_id: record_id,
          user_id: accessing_user_id
        }
      })
      userLevel = await User.findOne({
        where: {
          user_id: accessing_user_id
        },
        raw: true,
        attributes: ['user_level']
      })
      if (user !== null && (userLevel.user_level === 7 || userLevel.user_level === 8)) result = true
  }
  return result
}

export async function getAllUserActivities (queryObj = {}) {
  let query = { raw: true }
  query = { where: { ...queryObj }, ...query }
  return XUserActivity.findAll(query)
}
