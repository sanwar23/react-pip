import { XUserActivity } from '../../db/models'
import {
  createNewEntity,
  getXQodApplications,
  getUserById, getClientUsers, getClientIdByUserId
} from '../helper'
import { USER_LEVEL } from '../user/getSecurityContext'
import { Op } from 'sequelize'
import _ from 'lodash'

export async function postStatusUpdate ({ user_id, activity_value, activity_custom, activity_permission }) {
  await createNewEntity({
    model: XUserActivity,
    data: {
      user_id,
      record_type: 'activity',
      record_id: 0,
      activity_type: 'status',
      activity_value,
      activity_custom,
      activity_permission
    }
  })
}

export async function updatePostStatus ({
  user_id, user_activity_id,
  activity_value, activity_custom, activity_permission
}) {
  // To update post status activity_value & activity_custom data entry.
  await XUserActivity.update({
    activity_value,
    activity_custom,
    activity_permission
  }, {
    where: {
      user_id,
      user_activity_id
    }
  })
}

export async function getUserActivityById ({ user_activity_id }) {
  const userActivity = await XUserActivity.findOne({
    where: { user_activity_id },
    raw: true
  })
  return userActivity
}

export async function likeStatus ({ user_id, record_id, activity_permission }) {
  const isStatusLiked = await isUserLikedPost({ user_id, user_activity_id: record_id })
  let statusLikeActivity = { isUserAlreadyLiked: true }
  if (!isStatusLiked) {
    statusLikeActivity = await createNewEntity({
      model: XUserActivity,
      data: {
        user_id,
        record_type: 'activity',
        record_id,
        activity_type: 'like',
        activity_value: '1',
        activity_permission
      }
    })
  }
  return statusLikeActivity
}

export async function unlikeStatus ({ user_id, record_id, activity_permission }) {
  const isStatusLiked = await isUserLikedPost({ user_id, user_activity_id: record_id })
  let statusUnlikeActivity = { isUserAlreadyUnliked: true }
  if (isStatusLiked) {
    statusUnlikeActivity = await XUserActivity.destroy({
      where: {
        user_id,
        record_type: 'activity',
        record_id,
        activity_type: 'like',
        activity_permission
      }
    })
  }
  return statusUnlikeActivity
}

export async function getStatusLikesCount ({ record_id }) {
  const totalLikes = await XUserActivity.sum('activity_value', {
    where: {
      record_type: 'activity',
      record_id,
      activity_type: 'like'
    },
    raw: true
  })
  return (totalLikes || 0)
}

export async function isUserLikedPost ({ user_id, user_activity_id }) {
  const userActivity = await XUserActivity.findOne({
    where: {
      user_id,
      record_type: 'activity',
      activity_type: 'like',
      record_id: user_activity_id
    }
  })
  return !_.isEmpty(userActivity)
}

export async function commentStatus ({ user_id, record_id, activity_permission, activity_value }) {
  const newComment = await createNewEntity({
    model: XUserActivity,
    data: {
      user_id,
      record_type: 'activity',
      record_id,
      activity_type: 'comment',
      activity_value,
      activity_permission
    }
  })
  return {
    commentId: newComment.user_activity_id,
    createdAt: newComment.createdAt,
    content: newComment.activity_value
  }
}

export async function getStatusComments ({ user_id, record_id }) {
  const allComments = await XUserActivity.findAll({
    where: {
      record_type: 'activity',
      record_id,
      activity_type: 'comment',
      is_deleted: false
    },
    order: [['created_on', 'DESC']],
    raw: true
  })
  const visibleComments = allComments.filter(comment => async function () {
    checkVisibility({
      activity_permission: comment.activity_permission,
      owner_id: comment.user_id,
      user_id
    })
  })
  return visibleComments
}

export async function getStatusCommentsInBatch ({ record_id, limit, offset }) {
  // To fetch comments data based on limit and offset value
  const { rows, count } = await XUserActivity.findAndCountAll({
    where: {
      record_type: 'activity',
      record_id,
      activity_type: 'comment',
      is_deleted: false
    },
    limit,
    offset,
    order: [['created_on', 'DESC']],
    raw: true
  })
  return { comments: rows, count }
}

export async function getStatusCommentsCount ({ record_id }) {
  const totalComments = XUserActivity.count({
    where: {
      record_type: 'activity',
      record_id,
      activity_type: 'comment',
      is_deleted: false
    },
    raw: true
  })
  return (totalComments || 0)
}

export async function getAllActivityStatus ({ owner_id }) {
  const query = {
    record_id: 0,
    record_type: 'activity',
    activity_type: 'status',
    is_deleted: false
  }
  if (owner_id) {
    query.user_id = owner_id
  }
  const allStatuses = await XUserActivity.findAll({
    where: query,
    order: [['created_on', 'DESC']],
    raw: true
  })
  return allStatuses
}

export async function getStatusUpdates ({ user_id }) {
  const allStatuses = await XUserActivity.findAll({
    where: {
      record_id: 0,
      record_type: 'activity',
      activity_type: 'status'
    },
    order: [['created_on', 'DESC']],
    raw: true
  })
  const visibleStatuses = allStatuses.filter(status => async function () {
    checkVisibility({
      activity_permission: status.activity_permission,
      owner_id: status.user_id,
      user_id
    })
  })
  return visibleStatuses
}

export async function checkVisibility ({ activity_permission, user_id, owner_id }) {
  let permission = false
  let activity, owner, user, userBelongstoCompany
  switch (activity_permission) {
    case 'public':
      permission = true
      break
    case 'followers':
      // Check if user is following the owner of the status
      activity = await XUserActivity.findOne({
        where: {
          user_id,
          record_type: 'user',
          record_id: owner_id,
          activity_type: 'connection',
          activity_value: { [Op.in]: ['following', 'connected'] }
        }
      })
      permission = !!(activity && activity.user_activity_id)
      break
    case 'company':
      // Check if current user and status owner belongs to same company
      owner = await getClientIdByUserId({ user_id: owner_id })
      userBelongstoCompany = await isUserBelongsToCompany({ user_id, client_id: owner.client_id })
      permission = userBelongstoCompany
      break
    case 'admins':
      // company constraint with user-level greater and equal to 8
      owner = await getClientIdByUserId({ user_id: owner_id })
      userBelongstoCompany = await isUserBelongsToCompany({ user_id, client_id: owner.client_id })
      user = await getUserById({ user_id })
      permission = userBelongstoCompany && (user.user_level >= USER_LEVEL.ADMIN)
      break
    case 'managers':
      // company constraint with user-level greater and equal to 7
      owner = await getClientIdByUserId({ user_id: owner_id })
      userBelongstoCompany = await isUserBelongsToCompany({ user_id, client_id: owner.client_id })
      user = await getUserById({ user_id })
      permission = userBelongstoCompany && (user.user_level >= USER_LEVEL.SUPERVISOR)
      break
  }
  return permission
}

export async function isUserBelongsToCompany ({ user_id, client_id }) {
  // Check for hired users and client users for a client_id
  const hiredUsers = await getXQodApplications({
    where: {
      client_id,
      status: 'hired'
    },
    attribute: ['user_id']
  })

  let isUserBelongsToCompany = hiredUsers.find((hiredUser) => hiredUser.user_id === user_id)
  if (!isUserBelongsToCompany) {
    const clientUsers = await getClientUsers({ client_id })
    isUserBelongsToCompany = clientUsers.find((clientUser) => clientUser.user_id === user_id)
  }

  return !!isUserBelongsToCompany
}

export async function deleteStatusPost ({ user_activity_id }) {
  const postStatus = await XUserActivity.update({ is_deleted: true },
    { where: { user_activity_id } })

  // To soft delete comments associated with posted status
  await XUserActivity.update({ is_deleted: true }, {
    where: {
      record_type: 'activity',
      record_id: user_activity_id,
      activity_type: 'comment'
    }
  })

  // To hard delete likes data associated with posted status
  await XUserActivity.destroy({
    where: {
      record_type: 'activity',
      record_id: user_activity_id,
      activity_type: 'like'
    }
  })
  return postStatus
}

export async function deleteStatusPostComment ({ user_activity_id }) {
  const deletedPostComment = await XUserActivity.update({ is_deleted: true },
    {
      where: {
        user_activity_id,
        record_type: 'activity',
        activity_type: 'comment'
      }
    }
  )
  return deletedPostComment
}

export async function updateStatusPostComment ({ user_activity_id, updatedCommentText }) {
  const updatedPostComment = await XUserActivity.update({ activity_value: updatedCommentText },
    {
      where: {
        user_activity_id,
        record_type: 'activity',
        activity_type: 'comment'
      }
    }
  )
  return updatedPostComment
}
