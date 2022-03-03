'use strict'
module.exports = (sequelize, DataTypes) => {
  const XForumUser = sequelize.define('XForumUser', {
    forum_user_id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    user_id: DataTypes.INTEGER(11),
    forum_object_type: {
      type: DataTypes.ENUM,
      values: ['channel', 'topic', 'category']
    },
    forum_object_id: {
      type: DataTypes.INTEGER(11)
    },
    is_moderator: {
      type: DataTypes.BOOLEAN
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'x_forum_users'
  })
  XForumUser.associate = function (models) {
  }
  return XForumUser
}
