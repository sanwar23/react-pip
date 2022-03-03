import { XForumGroup, XForumTopic, UserDetail, XUserActivity, sequelize } from '../../db/models'
import { getAll, getOne } from './crud'
import { createNewEntity, updateEntity } from './common'
import { find, uniq } from 'lodash'

export async function createForumGroup ({ group_title, owner_id, group_description, permission }) {
  const newGroup = await createNewEntity({
    model: XForumGroup,
    data: {
      owner_id,
      group_title,
      group_description,
      permission
    }
  })
  return newGroup
}

export async function getOneForumGroup ({ group_id, user_id }) {
  const group = await getOne({
    model: XForumGroup,
    data: {
      group_id,
      is_deleted: false
    }
  })

  return group
}

export async function getAllForumGroups ({ user_id }) {
  let groups = await getAll({
    model: XForumGroup,
    data: {
      is_deleted: false
    }
  })

  groups = groups.map((group) => ({
    id: group.group_id,
    title: group.group_title,
    description: group.group_description,
    permission: group.permission,
    ownerId: group.owner_id
  }))

  return groups
}

export async function updateForumGroup ({ group_id, group_title, owner_id, group_description, permission }) {
  const updatedGroup = await updateEntity({
    model: XForumGroup,
    data: {
      group_id,
      owner_id,
      group_title,
      group_description,
      permission
    }
  })

  return updatedGroup
}

export async function deleteForumGroup ({ user_id, group_id }) {
  const deletedGroup = await XForumGroup.update({ is_deleted: true }, {
    where: {
      group_id
    }
  })

  await XUserActivity.update({ is_deleted: true }, {
    where: {
      record_id: group_id
    }
  })

  return deletedGroup
}

export async function getOwnersDetails (ownerIds) {
  return getAll({
    model: UserDetail,
    data: {
      user_id: ownerIds
    },
    attributes: ['user_id', 'first_name', 'last_name', 'profile_image']
  })
}

export async function getForumGroupTopics ({ user_id, group_id, limit, offset }) {
  let ownerIds = Array(0)
  let { rows, count } = await XForumTopic.findAndCountAll({
    where: {
      // owner_id: user_id,
      group_id,
      is_deleted: false
    },
    limit: JSON.parse(limit),
    offset: JSON.parse(offset),
    raw: true
  })

  rows = await Promise.all(rows.map(async ({ owner_id, topic_id, group_id, topic_title, topic_description, views, createdAt }) => {
    const counts = await XUserActivity.findAll({
      where: {
        record_type: 'topic',
        record_id: topic_id,
        is_deleted: false
      },
      attributes: [
        [sequelize.fn('sum', { activity_type: 'like', user_id: owner_id }), 'isUserLiked'],
        [sequelize.fn('sum', { activity_type: 'comment' }), 'commentsCount'],
        [sequelize.fn('sum', { activity_type: 'like' }), 'likesCount']
      ],
      raw: true
    })

    const { commentsCount, likesCount, isUserLiked } = counts && counts[0]

    ownerIds.push(owner_id)
    return ({
      id: topic_id,
      title: topic_title,
      description: topic_description,
      ownerId: owner_id,
      groupId: group_id,
      createdAt,
      views,
      commentsCount: commentsCount || 0,
      likesCount: likesCount || 0,
      isTopicLiked: isUserLiked || 0
    })
  }))

  // Remove duplicate Ids
  ownerIds = uniq(ownerIds)

  // Get owners' names and profile pictures
  const ownersDetails = await getOwnersDetails(ownerIds)
  rows = rows.map(({ ownerId, ...rest }) => {
    const ownerDetails = find(ownersDetails, (owner) => owner.user_id === ownerId)
    return {
      ...rest,
      ownerId,
      ownerName: ownerDetails && `${ownerDetails.first_name} ${ownerDetails.last_name}`,
      profilePic: ownerDetails && ownerDetails.profile_image
    }
  })

  return { rows, count }
}

export async function createForumTopic ({ topic_title, owner_id, topic_description, group_id }) {
  const newTopic = await createNewEntity({
    model: XForumTopic,
    data: {
      owner_id,
      group_id,
      topic_title,
      topic_description
    }
  })
  return newTopic
}

export async function updateForumTopic ({ topic_id, topic_title, owner_id, topic_description, group_id }) {
  const updatedGroup = await updateEntity({
    model: XForumTopic,
    data: {
      topic_id,
      topic_title,
      owner_id,
      group_id,
      topic_description
    }
  })

  return updatedGroup
}

export async function deleteForumGroupTopic ({ topic_id, group_id, owner_id }) {
  try {
    const deletedTopic = await XForumTopic.update({ is_deleted: true }, {
      where: {
        group_id,
        topic_id,
        owner_id
      }
    })
    await XUserActivity.update({ is_deleted: true }, {
      where: {
        record_id: topic_id
      }
    })

    return deletedTopic
  } catch (error) {
    return error
  }
}

export async function getForumTopicComments ({ topic_id, limit, offset }) {
  let ownerIds = Array(0)

  // update number of the times topic visited.
  await XForumTopic.update(
    { views: sequelize.literal('views +1') },
    { where: { topic_id }, returning: true }
  )

  let topicComments = await XUserActivity.findAll({
    where: {
      record_type: 'topic',
      record_id: topic_id,
      activity_type: 'comment',
      is_deleted: false
    },
    limit: JSON.parse(limit),
    offset: JSON.parse(offset),
    order: [['createdAt', 'DESC']],
    raw: true
  })

  topicComments = topicComments.map(({ user_activity_id, user_id, activity_value, created_on, record_id }) => {
    ownerIds.push(user_id)
    return {
      id: user_activity_id,
      comment: activity_value,
      ownerId: user_id,
      topicId: record_id,
      created_on
    }
  })

  // Remove duplicate Ids
  ownerIds = uniq(ownerIds)

  // Get owners' names and profile pictures
  const ownersDetails = await getOwnersDetails(ownerIds)

  topicComments = topicComments.map(({ ownerId, ...rest }) => {
    const ownerDetails = find(ownersDetails, (owner) => owner.user_id === ownerId)
    return {
      ...rest,
      ownerId,
      ownerName: ownerDetails && `${ownerDetails.first_name} ${ownerDetails.last_name}`,
      profilePic: ownerDetails && ownerDetails.profile_image
    }
  })

  return topicComments
}

export async function createForumComment ({ topic_id, comment, user_id }) {
  const newComment = await createNewEntity({
    model: XUserActivity,
    data: {
      user_id,
      record_type: 'topic',
      record_id: topic_id,
      activity_type: 'comment',
      activity_value: comment
    }
  })

  return newComment
}

export async function updateForumComment ({ topic_id, comment, user_id, id }) {
  const data = {
    user_id,
    record_type: 'topic',
    record_id: topic_id,
    activity_type: 'comment',
    activity_value: comment,
    user_activity_id: id
  }
  const updateComment = await XUserActivity.update(
    data, {
      where: {
        user_id,
        record_type: 'topic',
        record_id: topic_id,
        user_activity_id: id,
        activity_type: 'comment'
      }
    })

  return updateComment
}

export async function deleteForumComment ({ id, topic_id, user_id }) {
  const deleteComment = await XUserActivity.update({
    is_deleted: true
  }, {
    where: {
      user_activity_id: id,
      user_id: user_id,
      record_id: topic_id
    }
  })

  return deleteComment
}

export async function topicActivity ({ topic_id, user_id, activity }) {
  let response
  response = await XUserActivity.findOrCreate({
    where: {
      user_id,
      record_type: 'topic',
      record_id: topic_id,
      activity_type: 'like'
    },
    defaults: {
      user_id,
      record_type: 'topic',
      record_id: topic_id,
      activity_type: 'like',
      is_deleted: 0
    },
    raw: true
  })
  switch (activity) {
    case 'like': {
      if (response[0] && response[0].is_deleted) {
        response = await XUserActivity.update({
          is_deleted: 0
        }, {
          where: {
            user_activity_id: response[0].user_activity_id
          }
        })
      }
      break
    }
    case 'unlike': {
      response = await XUserActivity.update({
        is_deleted: 1
      }, {
        where: {
          user_activity_id: response[0].user_activity_id
        }
      })
      break
    }
    default:
      break
  }

  return response
}
