'use strict'
module.exports = (sequelize, DataTypes) => {
  const XForumGroup = sequelize.define('XForumGroup', {
    group_id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    owner_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    group_title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    group_description: {
      type: DataTypes.STRING
    },
    permission: {
      type: DataTypes.ENUM,
      values: ['public', 'private'],
      defaultValue: 'public'
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
    tableName: 'x_forum_groups',
    timestamps: true
  })
  XForumGroup.associate = function (models) {
  }
  return XForumGroup
}
