import jwt from 'jsonwebtoken'
import Sequelize, { Op } from 'sequelize'
import _ from 'lodash'
import config from '../../../config/app'
import { getOne } from './crud'
import {
  User, XClientUser, UserDetail, XClient, XUserActivity, XUserNotification, XQodApplication
} from '../../db/models'

export const getUserById = ({ user_id }) => {
  return User.findOne({ where: { user_id }, raw: true })
}

export const getClientIdByUserId = ({ user_id }) => {
  return XClientUser.findOne({ where: { user_id }, raw: true })
}

export const getClientUsers = ({ client_id }) => {
  return XClientUser.findAll({
    where: { client_id },
    raw: true
  })
}

export const getClientData = ({ client_id }) => {
  return XClient.findOne({
    where: { client_id },
    raw: true
  })
}

export const getUserDetailsByClientId = async ({ client_id }) => {
  const clientUser = await getOne({
    model: XClientUser,
    data: { client_id }
  })
  if (clientUser) {
    return UserDetail.findOne({ where: { user_id: clientUser.user_id }, raw: true })
  }
}

export const getUserDetails = ({ user_id }) => {
  return UserDetail.findOne({ where: { user_id }, raw: true })
}

export const getUserProfileImage = async ({ user_id }) => {
  const data = await UserDetail.findOne({
    where: { user_id },
    attributes: ['profile_image'],
    raw: true
  })

  return data && data.profile_image
}

export const getTokenAfterPostSignupCompleted = async ({ email, user_id, full_name, user_code }) => {
  await UserDetail.update({ is_post_signup_completed: true }, { where: { user_id } })
  const inviteLink = await getInviteLink({ user_id })
  const jwtToken = await jwt.sign({
    email,
    user_id,
    full_name,
    is_post_signup_completed: true,
    user_code,
    inviteLink
  },
  config.get('jwt.loginTokenSecret'), {
    expiresIn: config.get('jwt.loginTokenExpiry')
  })

  return jwtToken
}

export const getNewTokenAfterUserCodeChanged = async ({ email, user_id, full_name, user_code }) => {
  const jwtToken = await jwt.sign({
    email,
    user_id,
    full_name,
    is_post_signup_completed: false,
    user_code
  },
  config.get('jwt.loginTokenSecret'), {
    expiresIn: config.get('jwt.loginTokenExpiry')
  })

  return jwtToken
}

export const getInviteLink = async ({ user_id }) => {
  const baseInviteUrl = `${config.get('webApp.baseUrl')}/invite`
  let inviteLink = ''
  const { user: walletAddress } = await getOne({
    model: User,
    data: { user_id },
    attributes: ['user']
  })
  if (walletAddress) {
    inviteLink = `${baseInviteUrl}/${walletAddress}`
    return inviteLink
  }
}

export const getConnectionType = async ({ user_to_follow_id, follower_id }) => {
  const followingData = await XUserActivity.findOne({
    where: {
      user_id: follower_id,
      record_id: user_to_follow_id,
      activity_type: 'connection'
    },
    attributes: ['activity_value'],
    raw: true
  })

  return followingData && followingData.activity_value
}

export const getNoOfFollowersAndFollowings = async ({ user_id }) => {
  const followData = await XUserActivity.findOne({
    attributes: [
      [Sequelize.literal('COUNT(CASE WHEN `XUserActivity`.`record_id` = ' + user_id + ' THEN 1 END)'), 'noOfFollowers'],
      [Sequelize.literal('COUNT(CASE WHEN `XUserActivity`.`user_id` = ' + user_id + ' THEN 1 END)'), 'noOfFollowings']
    ],
    where: {
      activity_type: 'connection',
      activity_value: { [Op.in]: ['following', 'connected'] }
    },
    raw: true
  })

  return {
    noOfFollowers: followData.noOfFollowers,
    noOfFollowings: followData.noOfFollowings
  }
}

export const followOrUnfollowUser = async ({ user_to_follow_id, follower_id, userCode }) => {
  const promises = [
    () => getConnectionType({ user_to_follow_id, follower_id }),
    () => getConnectionType({ user_to_follow_id: follower_id, follower_id: user_to_follow_id })
  ]
  const [connectionType, reverseConnectionType] = await Promise.all(promises.map(promise => promise()))

  if (!connectionType) {
    await XUserActivity.create({
      user_id: follower_id,
      record_type: userCode,
      record_id: user_to_follow_id,
      activity_type: 'connection',
      activity_value: reverseConnectionType === 'following' ? 'connected' : 'following',
      activity_permission: 'public'
    })

    if (reverseConnectionType === 'following') {
      await XUserActivity.update(
        { activity_value: 'connected' },
        {
          where: {
            user_id: user_to_follow_id,
            record_id: follower_id,
            activity_type: 'connection'
          }
        }
      )
    }
  } else if (['following', 'connected'].includes(connectionType)) {
    await XUserActivity.destroy({
      where: {
        user_id: follower_id,
        record_id: user_to_follow_id,
        activity_type: 'connection'
      }
    })

    if (reverseConnectionType === 'connected') {
      await XUserActivity.update(
        { activity_value: 'following' },
        {
          where: {
            user_id: user_to_follow_id,
            record_id: follower_id,
            activity_type: 'connection'
          }
        }
      )
    }
  } else {
    return false
  }

  return true
}

export const blockOrUnblockUser = async ({ user_id, block_user_id }) => {
  const promises = [
    () => getConnectionType({ user_to_follow_id: block_user_id, follower_id: user_id }),
    () => getConnectionType({ user_to_follow_id: user_id, follower_id: block_user_id })
  ]
  const [connectionType, reverseConnectionType] = await Promise.all(promises.map(promise => promise()))

  if (['connected', 'following'].includes(connectionType)) {
    await XUserActivity.destroy({
      where: {
        user_id: user_id,
        record_id: block_user_id,
        activity_type: 'connection'
      }
    })
  } else if (_.isEqual(connectionType, 'blocked')) {
    return false
  }

  if (!reverseConnectionType) {
    await XUserActivity.create({
      user_id: block_user_id,
      record_type: 'user',
      record_id: user_id,
      activity_type: 'connection',
      activity_value: 'blocked',
      activity_permission: 'public'
    })
  } else if (reverseConnectionType === 'blocked') {
    await XUserActivity.destroy({
      where: {
        user_id: block_user_id,
        record_id: user_id,
        activity_type: 'connection'
      }
    })
  } else {
    await XUserActivity.update(
      { activity_value: 'blocked' },
      {
        where: {
          user_id: block_user_id,
          record_id: user_id,
          activity_type: 'connection'
        }
      }
    )
  }

  return true
}

export const addUserNotification = async ({ user_id, notice, record_id }) => {
  const promises = [
    () => XUserNotification.create({
      user_id,
      notice,
      record_id
    }),
    () => getUserProfileImage({ user_id: record_id })
  ]
  const [notification, imageUrl] = await Promise.all(promises.map(promise => promise()))

  return {
    id: notification.notification_id,
    message: notification.notice,
    isRead: notification.is_read,
    createdAt: notification.created_on,
    imageUrl
  }
}

export const deleteNotification = async ({ user_id, notice, record_id }) => {
  const notification = await XUserNotification.findOne({
    raw: true,
    attributes: ['notification_id'],
    where: {
      user_id,
      notice,
      record_id
    }
  })

  await XUserNotification.destroy({
    where: {
      user_id,
      notice,
      record_id
    }
  })

  const allRead = await areAllNotificationsRead({ user_id })

  return {
    notificationId: notification && notification.notification_id,
    allRead
  }
}

export const getUserNotifications = async ({ user_id, offset }) => {
  const promises = [
    () => XUserNotification.findAndCountAll({
      attributes: [
        ['notification_id', 'id'],
        ['notice', 'message'],
        ['is_read', 'isRead'],
        ['created_on', 'createdAt'],
        'record_id'
      ],
      where: { user_id },
      order: [['created_on', 'DESC']],
      limit: 5,
      offset: parseInt(offset),
      raw: true
    }),
    () => areAllNotificationsRead({ user_id })
  ]
  const [{ rows, count }, allRead] = await Promise.all(promises.map(promise => promise()))
  const recordIds = [...new Set(rows.map((row) => row.record_id))]
  const userData = await UserDetail.findAll({
    where: {
      user_id: recordIds
    },
    attributes: ['user_id', 'profile_image'],
    raw: true
  })
  const profileImages = Object.fromEntries(
    userData.map((user) => [user.user_id, user.profile_image])
  )

  return {
    allRead,
    count,
    notifications: rows.map((row) => ({
      ...row,
      imageUrl: profileImages[row.record_id]
    }))
  }
}

export const readUserNotifications = async ({ user_id, notification_ids }) => {
  await XUserNotification.update({
    is_read: true
  }, {
    where: {
      user_id,
      notification_id: notification_ids
    }
  })

  const allRead = await areAllNotificationsRead({ user_id })

  return { allRead }
}

export const deleteUserNotification = async ({ user_id, notification_id, offset }) => {
  await XUserNotification.destroy({
    where: { user_id, notification_id }
  })

  const promises = [
    () => XUserNotification.findAll({
      attributes: [
        ['notification_id', 'id'],
        ['notice', 'message'],
        ['is_read', 'isRead'],
        ['created_on', 'createdAt'],
        'record_id'
      ],
      where: { user_id },
      order: [['created_on', 'DESC']],
      limit: 1,
      offset: parseInt(offset)
    }),
    () => areAllNotificationsRead({ user_id })
  ]
  const [notifications, allRead] = await Promise.all(promises.map(promise => promise()))

  if (notifications && notifications[0]) {
    notifications[0] = notifications[0].get({ plain: true })
    notifications[0].imageUrl = await getUserProfileImage({ user_id: notifications[0].record_id })
  }

  return {
    notification: notifications && notifications[0],
    allRead
  }
}

export const areAllNotificationsRead = async ({ user_id }) => {
  const notification = await XUserNotification.findOne({
    where: {
      user_id,
      is_read: false
    },
    attributes: ['notification_id']
  })

  return !notification
}

export const getUserDetailsByUserId = async ({ user_id }) => {
  const userDetails = await UserDetail.findOne({
    raw: true,
    attributes: [
      ['notify_email', 'notifyEmail'],
      ['notify_sms', 'notifySms'],
      ['mobile_phone', 'mobileNumber']
    ],
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['email', 'user_code']
      }
    ],
    where: {
      user_id
    }
  })

  if (userDetails) {
    const { notifyEmail, notifySms } = userDetails
    let result = {
      notifyEmail,
      notifySms,
      emailId: userDetails['user.email']
    }

    if (userDetails['user.user_code'] === 'employer' && notifySms) {
      const clientUserId = await XClientUser.findOne({
        raw: true,
        attributes: ['client_id'],
        where: {
          user_id
        }
      })

      if (clientUserId && clientUserId.client_id) {
        const clientDetails = await XClient.findOne({
          raw: true,
          attributes: ['phone_number'],
          where: {
            client_id: clientUserId.client_id
          }
        })

        result = {
          ...result,
          mobileNumber: clientDetails && clientDetails.phone_number
        }
      }
    } else {
      result = {
        ...result,
        mobileNumber: userDetails.mobileNumber
      }
    }

    return result
  }
}

export const fetchUserCompanies = async ({ user_id }) => {
  const companiesList = await XQodApplication.findAll({
    raw: true,
    attributes: ['client_id'],
    where: {
      user_id,
      status: 'hired'
    }
  })

  return companiesList && companiesList.map((company) => company.client_id)
}

export const fetchClientDetails = async ({ clientIds }) => {
  const clientDetails = await XClient.findAll({
    raw: true,
    attributes: ['client_id', 'client_name'],
    where: {
      client_id: clientIds
    }
  })

  return clientDetails
}

export const formatCompaniesList = ({ clientDetails }) => {
  return clientDetails.map((company) => ({
    companyId: company.client_id,
    companyName: company.client_name
  }))
}

export const fetchCompaniesUsers = async ({ clientIds }) => {
  const companiesUsers = await XQodApplication.findAll({
    raw: true,
    attributes: ['user_id'],
    where: {
      client_id: clientIds,
      status: 'hired'
    }
  })

  return companiesUsers && companiesUsers.map((company) => company.user_id)
}

export const searchUsers = ({ searchString, offset }) => {
  return `
      SELECT count(*) over() as count, userDetails.profile_image, userDetails.work_title,
        userClientData.user_id, userClientData.client_id,
        userClientData.full_name, userClientData.user_code, userClientData.title, userClientData.client_name,
        IF(userClientData.user_code = "employer", userClientData.client_name, userClientData.full_name) as user_name
      FROM x_user_details userDetails
      JOIN (
        SELECT users.user_id, users.full_name, users.user_code, clientData.client_id, clientData.title,
          clientData.client_name
        FROM x_users users
        LEFT JOIN (
          SELECT clientUsers.user_id, clientDetails.client_id, clientDetails.title, clientDetails.client_name
          FROM x_client_users clientUsers
          JOIN (
            SELECT clients.client_id, clients.title, clients.client_name
            FROM x_clients clients
          ) clientDetails
          ON clientUsers.client_id = clientDetails.client_id
        ) clientData
        ON users.user_id = clientData.user_id
      ) userClientData
      ON userDetails.user_id = userClientData.user_id
      WHERE
        userDetails.is_post_signup_completed = 1 AND
        ((userClientData.user_code = "employer" AND userClientData.client_name like "%${searchString}%") OR
        (userClientData.user_code != "employer" AND userClientData.full_name like "%${searchString}%"))
      LIMIT 5
      OFFSET ${offset || 0}
  `
}

export const formatUserSearchResults = ({ users }) => (
  users.map((user) => ({
    userId: user.user_id,
    clientId: user.client_id,
    name: user.user_name,
    profileImage: user.profile_image,
    userType: user.user_code,
    title: user.user_code === 'employer' ? user.title : user.work_title,
    groupName: 'results'
  }))
)
