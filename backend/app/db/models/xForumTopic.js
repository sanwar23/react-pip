'use strict'
module.exports = (sequelize, DataTypes) => {
  const XForumTopic = sequelize.define('XForumTopic', {
    topic_id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    topic_title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    topic_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    owner_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    group_id: {
      type: DataTypes.INTEGER(11)
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    tags: {
      type: DataTypes.STRING(100)
    },
    is_public: {
      type: DataTypes.BOOLEAN
    },
    is_flagged: {
      type: DataTypes.BOOLEAN
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      field: 'created_on',
      type: DataTypes.DATE
    },
    updatedAt: {
      field: 'updated_on',
      type: DataTypes.DATE
    }
  },
  {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    tableName: 'x_forum_topics',
    timestamps: true
  })
  XForumTopic.associate = function (models) {
  }
  return XForumTopic
}
